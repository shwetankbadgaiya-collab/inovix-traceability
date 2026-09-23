import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import batchRoutes from './routes/batches.js';
import iotRoutes from './routes/iot.js';
import blockchainRoutes from './routes/blockchain.js';
import alertRoutes from './routes/alerts.js';
import qrRoutes from './routes/qr.js';
import verifyRoutes from './routes/verify.js';
import analyticsRoutes from './routes/analytics.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Allow configured frontend URL, Netlify domains, or local dev
    if (
      allowedOrigins.includes(origin) ||
      /\.netlify\.app$/.test(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin ${origin} not allowed by INOVIX policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Public Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'INOVIX API is running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
