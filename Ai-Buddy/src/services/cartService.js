import axios from 'axios';
import logger from '../utils/logger.js';

const timeout = parseInt(process.env.REQUEST_TIMEOUT || 5000);

const cartServiceClient = axios.create({
    baseURL: process.env.CART_SERVICE_URL || 'http://localhost:5002', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
cartServiceClient.interceptors.request.use(
    (config) => {
        logger.debug({ url: config.url, method: config.method }, 'Cart Service Request');
        return config;
    },
    (error) => {
        logger.error(error, 'Cart Service Request Error');
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
cartServiceClient.interceptors.response.use(
    (response) => {
        logger.debug({ status: response.status, url: response.config.url }, 'Cart Service Response');
        return response;
    },
    (error) => {
        logger.error(
            {
                status: error.response?.status,
                message: error.message,
                url: error.config?.url,
            },
            'Cart Service Response Error'
        );
        return Promise.reject(error);
    }
);

/**
 * Get user's cart
 */
export const getCart = async (token) => {
    try {
        const response = await cartServiceClient.get('/cart', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to fetch cart');
        throw error;
    }
};

/**
 * Add item to cart
 */
export const addToCart = async (productId, quantity, token) => {
    try {
        const response = await cartServiceClient.post(
            '/cart/items',
            { productId, qty: quantity },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        logger.error({ productId, quantity, error: error.message }, 'Failed to add item to cart');
        throw error;
    }
};

/**
 * Add multiple items to cart
 */
export const addMultipleToCart = async (items, token) => {
    try {
        const results = [];
        for (const item of items) {
            const result = await addToCart(item.productId, item.quantity, token);
            results.push(result);
        }
        return results;
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to add multiple items to cart');
        throw error;
    }
};

/**
 * Clear cart
 */
export const clearCart = async (token) => {
    try {
        const response = await cartServiceClient.delete('/cart', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        logger.error({ error: error.message }, 'Failed to clear cart');
        throw error;
    }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (productId, quantity, token) => {
    try {
        const response = await cartServiceClient.patch(
            `/cart/items/${productId}`,
            { qty: quantity },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        logger.error({ productId, quantity, error: error.message }, 'Failed to update cart item');
        throw error;
    }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (productId, token) => {
    try {
        const response = await cartServiceClient.delete(`/cart/items/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        logger.error({ productId, error: error.message }, 'Failed to remove item from cart');
        throw error;
    }
};
