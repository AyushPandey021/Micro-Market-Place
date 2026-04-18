import axios from 'axios';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:5002/api/cart';

export async function getCart(userId, token) {
    try {
        const response = await axios.get(CART_SERVICE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-user-id': userId
            }
        });
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching cart:', error.response?.data || error.message);
        throw new Error('Unable to fetch cart');
    }
}

export async function clearCart(userId, token) {
    try {
        await axios.delete(CART_SERVICE_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-user-id': userId
            }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        // Don't throw, as order is already created
    }
}