const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend is running', 
    timestamp: new Date() 
  });
});

const db = require('./db'); // Import your new db connection

// Database connection test endpoint
app.get('/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM nodes');
    res.json({ 
      status: 'DB connected successfully', 
      nodes_count: result.rows[0].count 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});