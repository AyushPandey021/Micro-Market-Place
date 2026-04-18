import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import {
    validateCreateRazorpayOrder,
    validateVerifyPayment,
    validatePaymentId
} from '../middleware/validation.middleware.js';
import {
    createRazorpayOrderController,
    verifyPaymentController,
    getPaymentController
} from '../controllers/paymentController.js';

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);

// POST /payments/razorpay/order - Create Razorpay order
router.post(
    '/razorpay/order',
    validateCreateRazorpayOrder,
    createRazorpayOrderController
);

// POST /payments/verify - Verify payment
router.post(
    '/verify',
    validateVerifyPayment,
    verifyPaymentController
);

// GET /payments/:id - Get payment details (buyer or admin)
router.get(
    '/:id',
    validatePaymentId,
    authorize('customer', 'admin'),
    getPaymentController
);

export default router;