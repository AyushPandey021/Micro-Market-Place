import api from "./api";

const basePath = "/ai-buddy";

export const askBuddy = (query, autoAddToCart = false, token = null) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post(`${basePath}/ask`, { query, autoAddToCart }, config);
};

export const searchProducts = (query, token = null) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post(`${basePath}/search`, { query }, config);
};

export const parseQuery = (query) => {
    return api.post(`${basePath}/parse`, { query });
};

export const addSingleProductToCart = (productId, quantity = 1, token = null) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post(`${basePath}/cart/add-single`, { productId, quantity }, config);
};

export const addProductsToCart = (productIds, quantities = {}) => {
    return api.post(`${basePath}/cart/add`, { productIds, quantities });
};

export const getCart = (token = null) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get(`${basePath}/cart`, config);
};
