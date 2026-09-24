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

// Configured origins supporting FRONTEND_URL, CORS_ORIGIN, Netlify, and local dev
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'https://inovix-traceability.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
]
  .filter(Boolean)
  .flatMap((url) => (url as string).split(',').map((u) => u.trim().replace(/\/+$/, '')))
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow explicitly configured origins, any Netlify subdomain, or non-production modes
    if (
      configuredOrigins.includes(cleanOrigin) ||
      /\.netlify\.app$/i.test(cleanOrigin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
