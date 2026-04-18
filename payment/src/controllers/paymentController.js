import Payment from '../models/payment.model.js';
import { createRazorpayOrder, verifyPayment, fetchPayment } from '../services/razorpay.service.js';
import { v4 as uuidv4 } from 'uuid';

export const createRazorpayOrderController = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        const userId = req.user.id;

        // Create unique receipt if not provided
        const finalReceipt = receipt || `receipt_${uuidv4()}`;

        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder(amount, currency, finalReceipt);

        // Save payment record
        const payment = new Payment({
            paymentId: razorpayOrder.orderId,
            orderId: finalReceipt, // Using receipt as orderId for now
            userId,
            amount,
            currency,
            method: 'razorpay',
            status: 'pending',
            transactionId: razorpayOrder.orderId,
            receipt: finalReceipt
        });

        await payment.save();

        res.status(201).json({
            success: true,
            data: razorpayOrder
        });
    } catch (error) {
        console.error('Create Razorpay order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create Razorpay order'
        });
    }
};

export const verifyPaymentController = async (req, res) => {
    try {
        const { paymentId, orderId, signature } = req.body;
        const userId = req.user.id;

        // Verify payment signature
        const isValid = verifyPayment(paymentId, orderId, signature);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Fetch payment details from Razorpay
        const paymentDetails = await fetchPayment(paymentId);

        // Update payment record
        const payment = await Payment.findOneAndUpdate(
            { paymentId: orderId, userId },
            {
                status: paymentDetails.status === 'captured' ? 'completed' : 'failed',
                gatewayPayload: paymentDetails,
                transactionId: paymentId
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment record not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: payment
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Payment verification failed'
        });
    }
};

export const getPaymentController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Allow access if user owns the payment or is admin
        const payment = await Payment.findOne({
            $or: [
                { paymentId: id, userId },
                { paymentId: id } // Admin can access any
            ]
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check permissions
        if (payment.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch payment'
        });
    }
};