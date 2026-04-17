import { describe, it, expect, jest } from '@jest/globals';
import request from 'supertest';

const productModelMock = {
    __esModule: true,
    default: {
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
            {
                _id: '1',
                title: 'Test Product 1',
                description: 'Description 1',
                priceAmount: 100,
                priceCurrency: 'INR',
                seller: 'seller1',
                images: [{ url: 'url1', fileId: 'fid1' }]
            },
            {
                _id: '2',
                title: 'Test Product 2',
                description: 'Description 2',
                priceAmount: 200,
                priceCurrency: 'INR',
                seller: 'seller2',
                images: [{ url: 'url2', fileId: 'fid2' }]
            }
        ])
    }
};

jest.unstable_mockModule('../src/models/product.model.js', () => productModelMock);

const { default: app } = await import('../src/app.js');

describe('GET /api/products/', () => {
    it('should retrieve products successfully', async () => {
        const response = await request(app)
            .get('/api/products/');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Products retrieved successfully');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);
        expect(response.body.data[0].title).toBe('Test Product 1');
    });

    it('should filter products by query', async () => {
        const response = await request(app)
            .get('/api/products/?q=test');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should filter products by min price', async () => {
        const response = await request(app)
            .get('/api/products/?minprice=150');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should filter products by max price', async () => {
        const response = await request(app)
            .get('/api/products/?maxprice=150');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('should handle skip and limit', async () => {
        const response = await request(app)
            .get('/api/products/?skip=1&limit=1');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});