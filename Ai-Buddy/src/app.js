import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
import aiBuddyRoutes from './routes/aibuddy.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(
    {
      method: req.method,
      path: req.path,
      ip: req.ip,
    },
    'Incoming request'
  );
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'AI Buddy',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/ai-buddy', aiBuddyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Buddy Service - Personal Shopping Assistant',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      ask: 'POST /ai-buddy/ask',
      search: 'POST /ai-buddy/search',
      cartAdd: 'POST /ai-buddy/cart/add',
      cartAddSingle: 'POST /ai-buddy/cart/add-single',
      cartGet: 'GET /ai-buddy/cart',
      parseQuery: 'POST /ai-buddy/parse',
    },
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn({ path: req.path, method: req.method }, 'Route not found');
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err, 'Unhandled error');
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

export default app;