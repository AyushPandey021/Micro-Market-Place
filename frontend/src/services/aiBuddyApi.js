import api from "./api";

const basePath = "/ai-buddy";

export const askBuddy = (query, autoAddToCart = false) => {
    return api.post(`${basePath}/ask`, { query, autoAddToCart });
};

export const searchProducts = (query) => {
    return api.post(`${basePath}/search`, { query });
};

export const parseQuery = (query) => {
    return api.post(`${basePath}/parse`, { query });
};

export const addSingleProductToCart = (productId, quantity = 1) => {
    return api.post(`${basePath}/cart/add-single`, { productId, quantity });
};

export const addProductsToCart = (productIds, quantities = {}) => {
    return api.post(`${basePath}/cart/add`, { productIds, quantities });
};

export const getCart = () => {
    return api.get(`${basePath}/cart`);
};
