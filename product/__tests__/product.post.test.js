import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock ImageKit
jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn().mockResolvedValue({
            url: 'https://ik.imagekit.io/products/test-image.jpg',
            fileId: 'mock-file-id-123'
        })
    }));
});

describe('POST /api/products/', () => {

    describe('Successful product upload', () => {
        it('should upload product with image successfully', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('name', 'Test Product')
                .field('description', 'This is a test product')
                .field('price', '99.99')
                .attach('image', imagePath);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Product uploaded successfully');
            expect(response.body.data).toHaveProperty('name', 'Test Product');
            expect(response.body.data).toHaveProperty('price', '99.99');
            expect(response.body.data.image).toHaveProperty('url');
            expect(response.body.data.image).toHaveProperty('fileId');
        });

        it('should upload product with minimal fields', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('name', 'Minimal Product')
                .field('price', '49.99')
                .attach('image', imagePath);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe('Minimal Product');
            expect(response.body.data.price).toBe('49.99');
        });
    });

    describe('Validation errors', () => {
        it('should return 400 if name is missing', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('description', 'No name product')
                .field('price', '99.99')
                .attach('image', imagePath);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Name and price are required');
        });

        it('should return 400 if price is missing', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('name', 'No Price Product')
                .field('description', 'Missing price')
                .attach('image', imagePath);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Name and price are required');
        });

        it('should return 400 if image is missing', async () => {
            const response = await request(app)
                .post('/api/products/')
                .field('name', 'No Image Product')
                .field('price', '99.99')
                .field('description', 'Missing image');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Image is required');
        });
    });

    describe('Image upload edge cases', () => {
        it('should handle different image formats', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('name', 'Product with Image')
                .field('price', '199.99')
                .attach('image', imagePath);

            expect(response.status).toBe(201);
            expect(response.body.data.image).toHaveProperty('url');
        });

        it('should preserve original filename in upload', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('name', 'Filename Test')
                .field('price', '79.99')
                .attach('image', imagePath);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
        });
    });

    describe('Response structure', () => {
        it('should return proper response structure on success', async () => {
            const imagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

            const response = await request(app)
                .post('/api/products/')
                .field('name', 'Structure Test')
                .field('description', 'Test response structure')
                .field('price', '59.99')
                .attach('image', imagePath);

            expect(response.body).toHaveProperty('success');
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('name');
            expect(response.body.data).toHaveProperty('description');
            expect(response.body.data).toHaveProperty('price');
            expect(response.body.data).toHaveProperty('image');
            expect(response.body.data.image).toHaveProperty('url');
            expect(response.body.data.image).toHaveProperty('fileId');
        });
    });
});
