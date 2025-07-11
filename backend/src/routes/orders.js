const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT 
        o.id, o.total_amount, o.status, o.created_at, o.tracking_number,
        json_agg(
          json_build_object(
            'id', oi.pet_id,
            'name', p.name,
            'breed', p.breed,
            'price', oi.price,
            'quantity', oi.quantity,
            'image', p.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN pets p ON oi.pet_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id, o.total_amount, o.status, o.created_at, o.tracking_number
      ORDER BY o.created_at DESC
    `, [userId]);

    const orders = result.rows.map(order => ({
      id: order.id,
      date: order.created_at,
      total: parseFloat(order.total_amount),
      status: order.status,
      tracking: order.tracking_number,
      items: order.items
    }));

    res.json(orders);
  } catch (error) {
    logger.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.pet_id,
            'name', p.name,
            'breed', p.breed,
            'price', oi.price,
            'quantity', oi.quantity,
            'image', p.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN pets p ON oi.pet_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];
    res.json({
      id: order.id,
      date: order.created_at,
      total: parseFloat(order.total_amount),
      status: order.status,
      tracking: order.tracking_number,
      items: order.items,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method
    });
  } catch (error) {
    logger.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user.userId;

    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method)
      VALUES ($1, $2, 'pending', $3, $4)
      RETURNING id, created_at
    `, [userId, totalAmount, shippingAddress, paymentMethod]);

    const orderId = orderResult.rows[0].id;

    // Create order items and update pet availability
    for (const item of items) {
      // Insert order item
      await client.query(`
        INSERT INTO order_items (order_id, pet_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.id, item.quantity, item.price]);

      // Update pet availability
      await client.query(`
        UPDATE pets SET available = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [item.id]);
    }

    await client.query('COMMIT');

    logger.info('Order created successfully', { orderId, userId, totalAmount });

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      createdAt: orderResult.rows[0].created_at
    });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

module.exports = router;