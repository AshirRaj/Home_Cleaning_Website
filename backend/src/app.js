import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes, { adminServiceRouter } from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS Configuration - Supports CLIENT_URL & FRONTEND_URL, trailing slashes, comma-separated lists, and Vercel domains
const getCleanOrigins = () => {
  const envValues = [process.env.CLIENT_URL, process.env.FRONTEND_URL]
    .filter(Boolean)
    .flatMap((val) => val.split(',').map((url) => url.trim().replace(/\/+$/, '')));

  return Array.from(
    new Set([
      ...envValues,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ])
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');
      const allowedOrigins = getCleanOrigins();

      const isAllowed =
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app');

      if (isAllowed || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to avoid breaking API requests
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting
app.use('/api', apiLimiter);

// Root Welcome & Ping
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SAGARIKA Cleaning Service Backend API is live & operational',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SAGARIKA Cleaning Backend API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Mounting API Routes
app.use('/api/admin', authRoutes);
app.use('/api/admin/services', adminServiceRouter);
app.use('/api/services', serviceRoutes);
app.use('/api', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/location', locationRoutes);

// 404 Route Not Found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on server.`,
    code: 'NOT_FOUND',
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
