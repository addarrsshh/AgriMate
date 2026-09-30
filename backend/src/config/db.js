const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[Database] No MONGODB_URI provided in .env. Running in offline/in-memory seed fallback mode.');
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection error: ${error.message}`);
    console.log('[Database] Falling back to robust in-memory mock store for local development.');
    isConnected = false;
    return false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  type: isConnected ? 'MongoDB Atlas' : 'In-Memory Development Store',
});

module.exports = { connectDB, getDBStatus };
