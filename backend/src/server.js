const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = require('./db');
const nodesRouter = require('./routes/nodes');
const roadsRouter = require('./routes/roads');

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Database Test
app.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM nodes');
    res.json({ status: 'DB connected', nodes_count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes
app.use('/api/nodes', nodesRouter);
app.use('/api/roads', roadsRouter);

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});