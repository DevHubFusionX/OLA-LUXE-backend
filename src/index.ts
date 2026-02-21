import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorHandler';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import deliveryZoneRoutes from './routes/deliveryZones';
import categoryRoutes from './routes/categories';
import uploadRoutes from './routes/uploadRoutes';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://192.168.198.128:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// ── Redirect Admin Routes to Frontend ─────────────────────────
app.get('/admin*', (_req, res) => {
  res.redirect(FRONTEND_URL + '/admin');
});

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Olaluxe API is running 🎉', timestamp: new Date() });
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API base: http://localhost:${PORT}/api`);
    console.log(`🔗 Admin redirects to: ${FRONTEND_URL}/admin`);
    console.log(`🌿 Environment: ${process.env.NODE_ENV}\n`);
  });
};

start();
