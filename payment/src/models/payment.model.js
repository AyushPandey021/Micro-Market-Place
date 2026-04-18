import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true,
        ref: 'Order'
    },
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'upi', 'paypal', 'cod', 'razorpay'],
        default: 'razorpay'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: true
    },
    gatewayPayload: {
        type: mongoose.Schema.Types.Mixed
    },
    receipt: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema);