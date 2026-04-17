// Set test environment
process.env.NODE_ENV = 'test';

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import cartRoutes from '../src/routes/cart.routes.js';
import Cart from '../src/models/cart.model.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/cart', cartRoutes);

describe('Cart API', () => {
    beforeAll(async () => {
        // Connect to test DB if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-cart');
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Cart.deleteMany({});
    });

    describe('GET /api/cart', () => {
        it('should return empty cart for new user', async () => {
            const response = await request(app).get('/api/cart');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.items).toEqual([]);
            expect(response.body.data.totalAmount).toBe(0);
        });

        it('should return cart with items', async () => {
            const cart = new Cart({
                userId: 'test-user',
                items: [
                    { productId: 'prod1', quantity: 2, price: 10 },
                    { productId: 'prod2', quantity: 1, price: 20 }
                ],
                totalAmount: 40
            });
            await cart.save();

            const response = await request(app).get('/api/cart');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.items).toHaveLength(2);
            expect(response.body.data.totalAmount).toBe(40);
        });
    });

    describe('POST /api/cart/items', () => {
        it('should add item to cart', async () => {
            const response = await request(app)
                .post('/api/cart/items')
                .send({ productId: 'prod1', quantity: 1 });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Item added to cart');

            const cart = await Cart.findOne({ userId: 'test-user' });
            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].productId).toBe('prod1');
            expect(cart.items[0].quantity).toBe(1);
        });

        it('should increment quantity for existing item', async () => {
            const cart = new Cart({
                userId: 'test-user',
                items: [{ productId: 'prod1', quantity: 1, price: 10 }]
            });
            await cart.save();

            const response = await request(app)
                .post('/api/cart/items')
                .send({ productId: 'prod1', quantity: 2 });

            expect(response.status).toBe(200);

            const updatedCart = await Cart.findOne({ userId: 'test-user' });
            expect(updatedCart.items[0].quantity).toBe(3);
        });
    });

    describe('PATCH /api/cart/items/:productId', () => {
        it('should update item quantity', async () => {
            const cart = new Cart({
                userId: 'test-user',
                items: [{ productId: 'prod1', quantity: 1, price: 10 }]
            });
            await cart.save();

            const response = await request(app)
                .patch('/api/cart/items/prod1')
                .send({ quantity: 3 });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            const updatedCart = await Cart.findOne({ userId: 'test-user' });
            expect(updatedCart.items[0].quantity).toBe(3);
        });

        it('should remove item when quantity is 0', async () => {
            const cart = new Cart({
                userId: 'test-user',
                items: [{ productId: 'prod1', quantity: 1, price: 10 }]
            });
            await cart.save();

            const response = await request(app)
                .patch('/api/cart/items/prod1')
                .send({ quantity: 0 });

            expect(response.status).toBe(200);

            const updatedCart = await Cart.findOne({ userId: 'test-user' });
            expect(updatedCart.items).toHaveLength(0);
        });
    });

    describe('DELETE /api/cart/items/:productId', () => {
        it('should remove item from cart', async () => {
            const cart = new Cart({
                userId: 'test-user',
                items: [
                    { productId: 'prod1', quantity: 1, price: 10 },
                    { productId: 'prod2', quantity: 2, price: 20 }
                ]
            });
            await cart.save();

            const response = await request(app)
                .delete('/api/cart/items/prod1');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            const updatedCart = await Cart.findOne({ userId: 'test-user' });
            expect(updatedCart.items).toHaveLength(1);
            expect(updatedCart.items[0].productId).toBe('prod2');
        });
    });

    describe('DELETE /api/cart', () => {
        it('should clear cart', async () => {
            const cart = new Cart({
                userId: 'test-user',
                items: [{ productId: 'prod1', quantity: 1, price: 10 }]
            });
            await cart.save();

            const response = await request(app)
                .delete('/api/cart');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            const clearedCart = await Cart.findOne({ userId: 'test-user' });
            expect(clearedCart).toBeNull();
        });
    });
});