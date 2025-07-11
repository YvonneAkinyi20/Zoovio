const express = require('express');
const pool = require('../config/database');
const { logger } = require('../utils/logger');

const router = express.Router();

// Get all pets with filtering
router.get('/', async (req, res) => {
  try {
    const {
      type,
      breed,
      age,
      minPrice,
      maxPrice,
      available = true,
      search,
      limit = 50,
      offset = 0
    } = req.query;

    let query = 'SELECT * FROM pets WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Add filters
    if (type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    if (breed) {
      paramCount++;
      query += ` AND breed ILIKE $${paramCount}`;
      params.push(`%${breed}%`);
    }

    if (age) {
      paramCount++;
      query += ` AND age = $${paramCount}`;
      params.push(age);
    }

    if (minPrice) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
    }

    if (available !== undefined) {
      paramCount++;
      query += ` AND available = $${paramCount}`;
      params.push(available);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR breed ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      pets: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    logger.error('Get pets error:', error);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

// Get single pet by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM pets WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get pet error:', error);
    res.status(500).json({ error: 'Failed to fetch pet' });
  }
});

// Update pet availability (when sold)
router.patch('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const result = await pool.query(
      'UPDATE pets SET available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    logger.info('Pet availability updated', { petId: id, available });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Update pet availability error:', error);
    res.status(500).json({ error: 'Failed to update pet availability' });
  }
});

module.exports = router;