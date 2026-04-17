import Cart from '../models/cart.model.js';

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.json({
                success: true,
                data: { items: [], totalAmount: 0 }
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cart'
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price: 0 }); // Price will be set later
        }

        // Recalculate total (simplified)
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.json({
            success: true,
            message: 'Item added to cart'
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart'
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(item => item.productId === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId !== productId);
        } else {
            item.quantity = quantity;
        }

        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.json({
            success: true,
            message: 'Cart updated'
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart'
        });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(item => item.productId !== productId);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item'
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await Cart.findOneAndDelete({ userId });

        res.json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }
};