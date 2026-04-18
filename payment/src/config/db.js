import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/payment-service');
        console.log(`Payment DB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Payment DB connection error:', error);
        process.exit(1);
    }
};