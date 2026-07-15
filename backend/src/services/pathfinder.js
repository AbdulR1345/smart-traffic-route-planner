const db = require('../db');

// Haversine formula - distance between 2 lat/lng points
function heuristic(nodeA, nodeB) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = nodeA.lat * Math.PI / 180;
  const φ2 = nodeB.lat * Math.PI / 180;
  const Δφ = (nodeB.lat - nodeA.lat) * Math.PI / 180;
  const Δλ = (nodeB.lng - nodeA.lng) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
}

// Custom cost function - this is what makes you different from Google Maps
function calculateCost(road) {
  // Weights: distance 50%, road_quality 20%, safety 15%, traffic 15%
  // Lower quality/safety = higher cost
  const qualityCost = (10 - road.road_quality) * 100;
  const safetyCost = (10 - road.safety_score) * 100;
  
  return (road.distance_meters * 0.5) + qualityCost + safetyCost;
}

async function findShortestPath(startNodeId, endNodeId) {
  // 1. Fetch all nodes and roads from DB
  const nodesRes = await db.query(`
    SELECT id, name, ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng 
    FROM nodes
  `);
  const roadsRes = await db.query(`SELECT * FROM roads`);

  const nodes = {};
  nodesRes.rows.forEach(n => nodes[n.id] = n);

  // 2. Build adjacency list
  const graph = {};
  roadsRes.rows.forEach(road => {
    if (!graph[road.source_node]) graph[road.source_node] = [];
    if (!graph[road.target_node]) graph[road.target_node] = [];

    // Assuming two-way roads for now
    graph[road.source_node].push({
      node: road.target_node,
      cost: calculateCost(road),
      roadId: road.id
    });
    graph[road.target_node].push({
      node: road.source_node,
      cost: calculateCost(road),
      roadId: road.id
    });
  });

  // 3. A* Algorithm
  const openSet = new Set([startNodeId]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  Object.keys(nodes).forEach(id => {
    gScore[id] = Infinity;
    fScore[id] = Infinity;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(nodes[startNodeId], nodes[endNodeId]);

  while (openSet.size > 0) {
    // Get node with lowest fScore
    let current = null;
    let lowestF = Infinity;

    for (let node of openSet) {
      if (fScore[node] < lowestF) {
        lowestF = fScore[node];
        current = node;
      }
    }

    if (current == endNodeId) {
      // Reconstruct path
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(parseInt(temp));
        temp = cameFrom[temp];
      }
      return { path, cost: gScore[endNodeId] };
    }

    openSet.delete(current);

    for (let neighbor of graph[current] || []) {
      const tentativeG = gScore[current] + neighbor.cost;

      if (tentativeG < gScore[neighbor.node]) {
        cameFrom[neighbor.node] = current;
        gScore[neighbor.node] = tentativeG;
        fScore[neighbor.node] = tentativeG + heuristic(nodes[neighbor.node], nodes[endNodeId]);
        openSet.add(neighbor.node);
      }
    }
  }

  return { path: [], cost: Infinity }; // No path found
}

module.exports = { findShortestPath };