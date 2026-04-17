import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import OrderRoutes from './routes/order.routes.js';
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/orders', OrderRoutes);

app.get('/', (req, res) => {
    res.send('Order Service is running!');
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found. Use /api/orders',
        path: req.originalUrl
    });
});

export default app;