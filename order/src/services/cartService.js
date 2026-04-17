import axios from 'axios';

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:5002/api/cart';

export async function getCart(userId) {
    try {
        const response = await axios.get(CART_SERVICE_URL, {
            headers: {
                'x-user-id': userId // Assuming cart service uses this header
            }
        });
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw new Error('Unable to fetch cart');
    }
}

export async function clearCart(userId) {
    try {
        await axios.delete(CART_SERVICE_URL, {
            headers: {
                'x-user-id': userId
            }
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        // Don't throw, as order is already created
    }
}