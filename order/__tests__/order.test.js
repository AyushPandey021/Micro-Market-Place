import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import Order from '../src/models/order.model.js';

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await Order.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Order Service', () => {
    describe('POST /api/orders', () => {
        it('should create an order', async () => {
            const orderData = {
                shippingAddress: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    country: 'USA',
                    zipCode: '12345'
                }
            };

            const response = await request(app)
                .post('/api/orders')
                .send(orderData);

            if (response.status !== 201) {
                console.log('Error response:', response.body);
            }

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('orderId');
        });
    });

    describe('GET /api/orders/me', () => {
        it('should get user orders', async () => {
            const response = await request(app)
                .get('/api/orders/me');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});