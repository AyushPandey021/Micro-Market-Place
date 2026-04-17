import express from 'express';
import {
    createOrder,
    getOrderById,
    getUserOrders,
    cancelOrder,
    updateOrderAddress
} from '../controllers/orderController.js';
import createAuthMiddleware from '../middleware/auth.middleware.js';
import {
    validateCreateOrder,
    validateGetOrder,
    validateCancelOrder,
    validateUpdateAddress
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Auth middleware for user
const authUser = createAuthMiddleware(['user', 'admin']);

// Routes
router.post('/', authUser, validateCreateOrder, createOrder);
router.get('/me', authUser, getUserOrders);
router.get('/:id', authUser, validateGetOrder, getOrderById);
router.post('/:id/cancel', authUser, validateCancelOrder, cancelOrder);
router.patch('/:id/address', authUser, validateUpdateAddress, updateOrderAddress);

export default router;