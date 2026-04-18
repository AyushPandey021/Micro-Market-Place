import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.model.js';
import { getCart, clearCart } from '../services/cartService.js';
import { checkInventory, updateInventory } from '../services/productService.js';
import { processPayment } from '../services/paymentService.js';
import { publishEvent } from '../services/rabbitmq.js';

// Create new order
export const createOrder = async (req, res) => {
    try {
        console.log('=== CREATE ORDER REQUEST ===');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('User:', req.user);

        const userId = req.user.id;
        const { shippingAddress } = req.body;

        // Extract token from Authorization header or cookies
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

        console.log('Creating order for user:', userId);
        console.log('Shipping address:', shippingAddress);
        console.log('Has token:', !!token);

        // Get user cart
        const cart = await getCart(userId, token);
        console.log('Cart retrieved:', cart);

        if (!cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty',
            });
        }

        // Check inventory
        const inventoryCheck = await checkInventory(cart.items);
        if (!inventoryCheck.available) {
            return res.status(400).json({
                success: false,
                message: 'Some items are out of stock',
                unavailableItems: inventoryCheck.unavailableItems,
            });
        }

        // Update each item with current product info
        const updatedItems = cart.items.map((item) => {
            const productInfo = inventoryCheck.itemsWithPrices.find(
                (p) => p.productId === item.productId
            );
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: productInfo.price,
                name: productInfo.name,
            };
        });

        // Calculate total amount
        const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // TODO: Process payment - temporarily disabled for testing
        // const paymentResult = await processPayment(totalAmount, req.user);
        // if (!paymentResult.success) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Payment failed',
        //     });
        // }

        // Mock payment result for testing
        const paymentResult = {
            success: true,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        // Create and save order
        const orderId = uuidv4();
        const order = new Order({
            orderId,
            userId,
            items: updatedItems,
            totalAmount,
            shippingAddress,
            paymentId: paymentResult.paymentId,
            status: 'pending',
            timeline: [
                {
                    status: 'created',
                    timestamp: new Date(),
                    note: 'Order created successfully',
                },
            ],
        });

        await order.save();

        // Reserve stock
        await updateInventory(cart.items, 'reserve');

        // Clear user cart
        await clearCart(userId, token);

        // Publish event
        await publishEvent('order.created', {
            orderId,
            userId,
            items: updatedItems,
            totalAmount,
            shippingAddress,
        });

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId,
                totalAmount,
                status: 'pending',
            },
        });
    } catch (error) {
        console.error('Error creating order:', error.message, error.response?.data || error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
};

// Get a single order for a user
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ orderId: id, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
        });
    }
};

// Get all orders for a user
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
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
        });
    }
};

// Cancel an order
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ orderId: id, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled',
            });
        }

        order.status = 'cancelled';
        order.timeline.push({
            status: 'cancelled',
            timestamp: new Date(),
            note: 'Order cancelled by user',
        });

        await order.save();

        await updateInventory(order.items, 'release');
        await publishEvent('order.cancelled', {
            orderId: id,
            userId,
            items: order.items,
        });

        res.json({
            success: true,
            message: 'Order cancelled successfully',
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
        });
    }
};

// Update an order’s shipping address
export const updateOrderAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { shippingAddress } = req.body;

        const order = await Order.findOne({ orderId: id, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order address cannot be updated',
            });
        }

        order.shippingAddress = shippingAddress;
        order.timeline.push({
            status: 'address_updated',
            timestamp: new Date(),
            note: 'Shipping address updated by user',
        });

        await order.save();

        res.json({
            success: true,
            message: 'Order address updated successfully',
        });
    } catch (error) {
        console.error('Error updating order address:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order address',
        });
    }
};
