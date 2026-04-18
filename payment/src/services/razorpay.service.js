import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

const getRazorpayInstance = () => {
    if (!razorpayInstance) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay credentials not configured');
        }
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

export const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
    try {
        const razorpay = getRazorpayInstance();
        const options = {
            amount: amount * 100, // Razorpay expects amount in paisa
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        return {
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency
        };
    } catch (error) {
        throw new Error(`Razorpay order creation failed: ${error.message}`);
    }
};

export const verifyPayment = (paymentId, orderId, signature) => {
    try {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        return expectedSignature === signature;
    } catch (error) {
        throw new Error(`Payment verification failed: ${error.message}`);
    }
};

export const fetchPayment = async (paymentId) => {
    try {
        const razorpay = getRazorpayInstance();
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        throw new Error(`Failed to fetch payment: ${error.message}`);
    }
};