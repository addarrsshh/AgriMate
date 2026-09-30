const express = require('express');
const cors = require('cors');
const { getDBStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const cropRoutes = require('./routes/cropRoutes');
const marketRoutes = require('./routes/marketRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const decisionRoutes = require('./routes/decisionRoutes');
const profitRoutes = require('./routes/profitRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development, mobile apps, or same-origin
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'healthy',
    service: 'AgriMate REST API',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    integrations: {
      aiConfigured: Boolean(process.env.AI_API_KEY),
      aiProvider: process.env.AI_PROVIDER || 'gemini',
      weatherConfigured: Boolean(process.env.WEATHER_API_KEY)
    }
  });
});

// API Routes Mounting
app.use('/api/crops', cropRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/ai', aiRoutes);

// 404 Route Catch-all
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on AgriMate REST API`
  });
});

// Centralized Error Interceptor
app.use(errorHandler);

module.exports = app;
