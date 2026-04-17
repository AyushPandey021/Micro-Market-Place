import axios from 'axios';

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5003/api/payments';

export async function processPayment(amount, user) {
    try {
        // Simulate payment processing
        // In a real implementation, this would call a payment gateway
        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // For demo purposes, assume payment always succeeds
        return {
            success: true,
            paymentId,
            amount,
            status: 'completed'
        };
    } catch (error) {
        console.error('Error processing payment:', error);
        return {
            success: false,
            error: 'Payment processing failed'
        };
    }
}

export async function getPaymentSummary(orderId) {
    try {
        const response = await axios.get(`${PAYMENT_SERVICE_URL}/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment summary:', error);
        return null; // Return null if not found
    }
}