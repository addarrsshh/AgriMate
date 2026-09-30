import mongoose from 'mongoose';
import { IDBStatus } from '../types';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[Database] MongoDB connection error: ${message}`);
    console.log('[Database] Falling back to robust in-memory mock store for local development.');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = (): IDBStatus => ({
  connected: isConnected || mongoose.connection.readyState === 1,
  type: (isConnected || mongoose.connection.readyState === 1) ? 'MongoDB Atlas' : 'In-Memory Development Store',
});
