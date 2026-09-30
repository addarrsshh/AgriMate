import express, { Request, Response } from 'express';
import cors from 'cors';
import { getDBStatus, connectDB } from './config/db';
import { seedDatabaseIfEmpty } from './services/dataAccessService';
import errorHandler from './middleware/errorHandler';

// Route Imports
import cropRoutes from './routes/cropRoutes';
import marketRoutes from './routes/marketRoutes';
import weatherRoutes from './routes/weatherRoutes';
import decisionRoutes from './routes/decisionRoutes';
import profitRoutes from './routes/profitRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();

// Idempotent database connection initialization for serverless & local runtimes
let dbInitPromise: Promise<void> | null = null;
export const ensureDatabaseInitialized = async (): Promise<void> => {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      await connectDB();
      await seedDatabaseIfEmpty();
    })();
  }
  return dbInitPromise;
};

// Database Initialization Middleware
app.use(async (_req, _res, next) => {
  try {
    await ensureDatabaseInitialized();
    next();
  } catch (err) {
    next(err);
  }
});

// CORS Configuration
app.use(cors({
  origin: (_origin, callback) => {
    // Allow local development, mobile apps, Vercel deployments, or same-origin
    return callback(null, true);
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Handler
const healthCheckHandler = (_req: Request, res: Response): void => {
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
};

// Health Check Endpoints (Preserves /api/health contract, plus /health for cloud health checks)
app.get('/api/health', healthCheckHandler);
app.get('/health', healthCheckHandler);

// API Routes Mounting
app.use('/api/crops', cropRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/ai', aiRoutes);

// Fallback mounts if proxy rewrites strip the /api prefix
app.use('/crops', cropRoutes);
app.use('/markets', marketRoutes);
app.use('/weather', weatherRoutes);
app.use('/decisions', decisionRoutes);
app.use('/profit', profitRoutes);
app.use('/ai', aiRoutes);

// 404 Route Catch-all
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on AgriMate REST API`
  });
});

// Centralized Error Interceptor
app.use(errorHandler);

export default app;
