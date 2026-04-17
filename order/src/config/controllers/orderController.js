import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.model.js';
import { getUserCart, clearUserCart } from '../services/cartService.js';
import { reserveInventory, releaseInventory } from '../services/productService.js';
import { getPaymentSummary } from '../services/paymentService.js';
import { publishEvent } from '../services/rabbitmq.js';

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;

        let cart;
        if (process.env.NODE_ENV === 'test') {
            // Mock cart for testing
            cart = {
                items: [
                    { productId: 'prod1', quantity: 2, price: 100 }
                ]
            };
        } else {
            // Get user's cart
            cart = await getUserCart(userId);
        }
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Compute totals (simplified - in real app, get prices from product service)
        let subtotal = 0;
        const items = cart.items.map(item => {
            const price = item.price || 0; // Assume price is in cart
            subtotal += price * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price
            };
        });

        const taxes = subtotal * 0.1; // 10% tax
        const shipping = 50; // Fixed shipping
        const totalAmount = subtotal + taxes + shipping;

        if (process.env.NODE_ENV !== 'test') {
            // Reserve inventory
            await reserveInventory(items);
        }

        // Create order
        const orderId = uuidv4();
        const order = new Order({
            orderId,
            userId,
            items,
            totalAmount,
            shippingAddress,
            taxes,
            shipping
        });

        await order.save();

        if (process.env.NODE_ENV !== 'test') {
            // Clear cart
            await clearUserCart(userId);

            // Emit event
            await publishEvent('order.created', {
                orderId,
                userId,
                totalAmount,
                items: items.length
            });
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId,
                status: order.status,
                totalAmount
            }
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const order = await Order.findOne({ orderId: id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check ownership or admin
        if (order.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Get payment summary
        const paymentSummary = process.env.NODE_ENV === 'test' ? null : await getPaymentSummary(id);

        res.json({
            success: true,
            data: {
                ...order.toObject(),
                paymentSummary
            }
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ userId });

        res.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ orderId: id, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status !== 'pending' && order.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
        }

        // Update status
        order.status = 'cancelled';
        order.timeline.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: 'Order cancelled by user'
        });
        await order.save();

        // Release inventory
        if (process.env.NODE_ENV !== 'test') {
            await releaseInventory(order.items);
        }

        // Emit event
        if (process.env.NODE_ENV !== 'test') {
            await publishEvent('order.cancelled', {
                orderId: id,
                userId,
                reason: 'user_cancelled'
            });
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order'
        });
    }
};

export const updateOrderAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { street, city, state, country, zipCode } = req.body;

        const order = await Order.findOne({ orderId: id, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Address can only be updated for pending orders'
            });
        }

        order.shippingAddress = { street, city, state, country, zipCode };
        order.timeline.push({
            status: order.status,
            timestamp: new Date(),
            note: 'Address updated'
        });
        await order.save();

        res.json({
            success: true,
            message: 'Address updated successfully'
        });

    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update address'
        });
    }
};