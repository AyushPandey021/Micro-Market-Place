import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5000/api/products';

export async function checkInventory(items) {
    try {
        // Check if all items are in stock
        const availabilityPromises = items.map(async (item) => {
            const response = await axios.get(`${PRODUCT_SERVICE_URL}/${item.productId}`);
            const product = response.data;
            return {
                productId: item.productId,
                available: product.stock >= item.quantity,
                availableStock: product.stock
            };
        });

        const availabilityResults = await Promise.all(availabilityPromises);
        const unavailableItems = availabilityResults.filter(result => !result.available);

        return {
            available: unavailableItems.length === 0,
            unavailableItems
        };
    } catch (error) {
        console.error('Error checking inventory:', error);
        throw new Error('Unable to check inventory');
    }
}

export async function updateInventory(items, action) {
    try {
        if (action === 'reserve') {
            // Reserve stock for order
            await axios.post(`${PRODUCT_SERVICE_URL}/reserve`, { items });
        } else if (action === 'release') {
            // Release reserved stock
            await axios.post(`${PRODUCT_SERVICE_URL}/release`, { items });
        }
    } catch (error) {
        console.error('Error updating inventory:', error);
        // Log but don't throw
    }
}