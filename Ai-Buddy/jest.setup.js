import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PRODUCT_SERVICE_URL = 'http://localhost:5001';
process.env.CART_SERVICE_URL = 'http://localhost:5002';
process.env.AUTH_SERVICE_URL = 'http://localhost:5000';
process.env.LOG_LEVEL = 'error'; // Suppress logs during tests

// Suppress console output in tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
