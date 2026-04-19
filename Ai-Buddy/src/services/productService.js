import axios from 'axios';
import logger from '../utils/logger.js';

const timeout = parseInt(process.env.REQUEST_TIMEOUT || 5000);

const productServiceClient = axios.create({
    baseURL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5001',
    timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
productServiceClient.interceptors.request.use(
    (config) => {
        logger.debug({ url: config.url, method: config.method }, 'Product Service Request');
        return config;
    },
    (error) => {
        logger.error(error, 'Product Service Request Error');
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
productServiceClient.interceptors.response.use(
    (response) => {
        logger.debug({ status: response.status, url: response.config.url }, 'Product Service Response');
        return response;
    },
    (error) => {
        logger.error(
            {
                status: error.response?.status,
                message: error.message,
                url: error.config?.url,
            },
            'Product Service Response Error'
        );
        return Promise.reject(error);
    }
);

/**
 * Search products in Product Service
 */
export const searchProducts = async (filters, token) => {
    try {
        const config = {
            params: filters,
        };

        if (token) {
            config.headers = { Authorization: `Bearer ${token}` };
        }

        const response = await productServiceClient.get('/products', config);
        return response.data;
    } catch (error) {
        logger.error({ error: error.message, filters }, 'Failed to search products');
        throw error;
    }
};

/**
 * Get product details
 */
export const getProductDetails = async (productId, token) => {
    try {
        const config = {};
        if (token) {
            config.headers = { Authorization: `Bearer ${token}` };
        }

        const response = await productServiceClient.get(`/products/${productId}`, config);
        return response.data;
    } catch (error) {
        logger.error({ productId, error: error.message }, 'Failed to fetch product details');
        throw error;
    }
};

/**
 * Get multiple products
 */
export const getProducts = async (productIds, token) => {
    try {
        const config = {
            params: { ids: productIds.join(',') },
        };

        if (token) {
            config.headers = { Authorization: `Bearer ${token}` };
        }

        const response = await productServiceClient.get('/products', config);
        return response.data;
    } catch (error) {
        logger.error({ productIds, error: error.message }, 'Failed to fetch products');
        throw error;
    }
};
