const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Create Stripe checkout session
router.post('/create-session', authenticateToken, async (req, res) => {
  try {
    const { items, customerId } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `${item.breed} - Age: ${item.age || 'N/A'}`,
          images: [item.image || ''],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.userId,
        customerId: customerId,
        items: JSON.stringify(items.map(item => ({ id: item.id, quantity: item.quantity })))
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'GR', 'CZ', 'HU', 'PL', 'SK', 'SI', 'EE', 'LV', 'LT', 'MT', 'CY', 'HR', 'BG', 'RO'],
      },
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          userId: req.user.userId,
          orderType: 'pet_purchase'
        }
      }
    });

    logger.info('Checkout session created', { 
      sessionId: session.id, 
      userId: req.user.userId, 
      totalAmount 
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Handle Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      logger.info('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});

async function handleCheckoutCompleted(session) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { userId, items } = session.metadata;
    const parsedItems = JSON.parse(items);

    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (
        user_id, 
        total_amount, 
        status, 
        payment_method, 
        stripe_session_id,
        shipping_address
      )
      VALUES ($1, $2, 'paid', 'stripe', $3, $4)
      RETURNING id
    `, [
      userId, 
      session.amount_total / 100, 
      session.id,
      JSON.stringify(session.shipping_details)
    ]);

    const orderId = orderResult.rows[0].id;

    // Create order items and update pet availability
    for (const item of parsedItems) {
      // Get pet details
      const petResult = await client.query('SELECT * FROM pets WHERE id = $1', [item.id]);
      const pet = petResult.rows[0];

      // Insert order item
      await client.query(`
        INSERT INTO order_items (order_id, pet_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.id, item.quantity, pet.price]);

      // Update pet availability
      await client.query(`
        UPDATE pets SET available = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [item.id]);
    }

    // Log transaction
    await client.query(`
      INSERT INTO transactions (
        order_id, 
        stripe_session_id, 
        amount, 
        currency, 
        status, 
        payment_method
      )
      VALUES ($1, $2, $3, $4, 'completed', 'stripe')
    `, [orderId, session.id, session.amount_total / 100, session.currency]);

    await client.query('COMMIT');

    logger.info('Order completed successfully', { 
      orderId, 
      userId, 
      sessionId: session.id,
      amount: session.amount_total / 100
    });

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Handle checkout completed error:', error);
  } finally {
    client.release();
  }
}

async function handlePaymentSucceeded(paymentIntent) {
  try {
    await pool.query(`
      UPDATE transactions 
      SET status = 'completed', updated_at = CURRENT_TIMESTAMP
      WHERE stripe_payment_intent_id = $1
    `, [paymentIntent.id]);

    logger.info('Payment succeeded', { paymentIntentId: paymentIntent.id });
  } catch (error) {
    logger.error('Handle payment succeeded error:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    await pool.query(`
      UPDATE transactions 
      SET status = 'failed', updated_at = CURRENT_TIMESTAMP
      WHERE stripe_payment_intent_id = $1
    `, [paymentIntent.id]);

    logger.info('Payment failed', { paymentIntentId: paymentIntent.id });
  } catch (error) {
    logger.error('Handle payment failed error:', error);
  }
}

module.exports = router;