import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

connectDB();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Cart service is running on port ${PORT}`);
    console.log(`Send requests to http://localhost:${PORT}/api/cart`);
});