const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/nodes - Fetch all junctions for dropdowns
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng 
      FROM nodes 
      ORDER BY name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;