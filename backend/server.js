const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { checkConnection } = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database & Backend Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbHealth = await checkConnection();
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    database: dbHealth
  });
});

// API Routes
app.use('/api/items', itemRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to myapp Backend API',
    endpoints: {
      health: 'GET /api/health',
      items: 'GET /api/items',
      createItem: 'POST /api/items',
      updateItem: 'PUT /api/items/:id',
      deleteItem: 'DELETE /api/items/:id'
    }
  });
});

// Start Express Server
app.listen(PORT, async () => {
  console.log(`==================================================`);
  console.log(`🚀 myapp Backend Server running on http://localhost:${PORT}`);
  const dbHealth = await checkConnection();
  if (dbHealth.status === 'connected') {
    console.log(`✅ MySQL DB Status: CONNECTED (${dbHealth.host} / ${dbHealth.database})`);
  } else {
    console.log(`⚠️ MySQL DB Status: DISCONNECTED (${dbHealth.error})`);
    console.log(`   Running with automatic in-memory fallback support.`);
  }
  console.log(`==================================================`);
});
