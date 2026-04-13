import express from 'express';
import cookieParser from 'cookie-parser';
import ProductRoutes from './routes/product.routes.js';
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/api/products', ProductRoutes);

app.get('/', (req, res) => {
    res.send('Product Service is running!');
});

export default app;
