import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cartRoutes from './routes/cart.routes.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cart', cartRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'cart' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

export default app;