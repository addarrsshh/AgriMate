require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { seedDatabaseIfEmpty } = require('./services/dataAccessService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database (Atlas or fallback)
  await connectDB();
  await seedDatabaseIfEmpty();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  🌾 AgriMate REST API Server Running!`);
    console.log(`  🚀 Port: http://localhost:${PORT}`);
    console.log(`  🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`  🌱 Crops: http://localhost:${PORT}/api/crops`);
    console.log(`  📈 Markets: http://localhost:${PORT}/api/markets/prices/current`);
    console.log(`=======================================================`);
  });

  // Graceful Shutdown
  const shutdown = () => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] HTTP listener closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch(err => {
  console.error('[Server Fatal] Could not start server:', err);
  process.exit(1);
});
