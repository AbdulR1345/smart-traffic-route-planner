const express = require('express');
const router = express.Router();
const db = require('../db');
const { findShortestPath } = require('../services/pathfinder');

// GET /api/roads/path?start=1&end=5 - Calculate and format route for the map
router.get('/path', async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start and end required' });

    const { path, cost } = await findShortestPath(parseInt(start), parseInt(end));
    if (path.length === 0) return res.status(404).json({ error: 'No route found' });

    // Get road geometries for the path to draw the line on the map
    let routeGeometry = [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const roadRes = await db.query(`
        SELECT ST_AsGeoJSON(geometry) as geojson, distance_meters, road_quality, safety_score, name 
        FROM roads 
        WHERE (source_node = $1 AND target_node = $2) OR (source_node = $2 AND target_node = $1)
        LIMIT 1
      `, [path[i], path[i + 1]]);

      if (roadRes.rows.length > 0) {
        const geo = JSON.parse(roadRes.rows[0].geojson);
        routeGeometry.push({
          ...roadRes.rows[0],
          coordinates: geo.coordinates
        });
      }
    }

    res.json({ 
      path, 
      total_cost: cost, 
      segments: routeGeometry 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;