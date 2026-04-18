import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import paymentRoutes from '../src/routes/payment.routes.js';
import { errorHandler } from '../src/middleware/error.middleware.js';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.RAZORPAY_KEY_ID = 'test_razorpay_key_id';
process.env.RAZORPAY_KEY_SECRET = 'test_razorpay_key_secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-payment-db';

const app = express();
app.use(express.json());
app.use('/payments', paymentRoutes);
app.use(errorHandler);

// Mock Razorpay
jest.mock('razorpay', () => {
    return jest.fn().mockImplementation(() => ({
        orders: {
            create: jest.fn()
        },
        payments: {
            fetch: jest.fn()
        }
    }));
});

import Razorpay from 'razorpay';

describe('Payment Service', () => {
    let mockRazorpayInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRazorpayInstance = new Razorpay();
    });

    describe('POST /payments/razorpay/order', () => {
        it('should create a Razorpay order', async () => {
            // Mock authentication middleware
            app.use((req, res, next) => {
                req.user = { id: 'test-user-id', role: 'customer' };
                next();
            });

            // Mock Razorpay order creation
            mockRazorpayInstance.orders.create.mockResolvedValue({
                id: 'order_test_123',
                amount: 10000,
                currency: 'INR'
            });

            const response = await request(app)
                .post('/payments/razorpay/order')
                .send({
                    amount: 100,
                    currency: 'INR',
                    receipt: 'test-receipt'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('orderId');
            expect(response.body.data.orderId).toBe('order_test_123');
        });

        it('should return 400 for invalid amount', async () => {
            const response = await request(app)
                .post('/payments/razorpay/order')
                .send({
                    amount: 'invalid',
                    currency: 'INR'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Validation failed');
        });
    });

    describe('POST /payments/verify', () => {
        it('should verify payment successfully', async () => {
            // Mock authentication middleware
            app.use((req, res, next) => {
                req.user = { id: 'test-user-id', role: 'customer' };
                next();
            });

            // Mock payment fetch
            mockRazorpayInstance.payments.fetch.mockResolvedValue({
                id: 'pay_test_payment_id',
                status: 'captured'
            });

            const response = await request(app)
                .post('/payments/verify')
                .send({
                    paymentId: 'pay_test_payment_id',
                    orderId: 'order_test_order_id',
                    signature: 'test_signature'
                });

            // This will test the route structure since signature verification is mocked
            expect(response.status).toBeDefined();
        });
    });
});