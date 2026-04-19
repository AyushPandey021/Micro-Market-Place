import natural from 'natural';
import logger from './logger.js';

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

/**
 * Parse natural language query to extract search filters
 * Example: "Find me red sneakers under ₹2000" 
 * Returns: { keywords: ['red', 'sneaker'], maxPrice: 2000, category: 'shoes', ... }
 */
export const parseQuery = (query) => {
    try {
        const lowerQuery = query.toLowerCase().trim();
        const tokens = tokenizer.tokenize(lowerQuery);
        const stemmedTokens = tokens.map(token => stemmer.stem(token));

        const filters = {
            keywords: [],
            maxPrice: null,
            minPrice: null,
            category: null,
            color: null,
            size: null,
            sortBy: 'relevance',
            confidence: 0,
        };

        // Extract price range
        const priceMatch = lowerQuery.match(/under\s+₹?([\d,]+)|₹?([\d,]+)\s*(?:to|and)\s*₹?([\d,]+)|below\s+₹?([\d,]+)|max\s*:?\s*₹?([\d,]+)/i);
        if (priceMatch) {
            const amount = priceMatch[1] || priceMatch[4] || priceMatch[5];
            if (amount) {
                filters.maxPrice = parseInt(amount.replace(/,/g, ''));
            }
        }

        // Extract color
        const colorKeywords = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey', 'silver', 'gold'];
        const foundColor = stemmedTokens.find(token => colorKeywords.includes(token));
        if (foundColor) {
            filters.color = foundColor;
        }

        // Extract category
        const categoryKeywords = {
            'shoe': ['shoe', 'sneak', 'boot', 'sandal'],
            'shirt': ['shirt', 'tee', 'top'],
            'pant': ['pant', 'jean', 'short'],
            'watch': ['watch', 'clock'],
            'jewel': ['ring', 'necklac', 'bracelet', 'earring'],
            'bag': ['bag', 'backpack', 'suitcase'],
        };

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (stemmedTokens.some(token => keywords.includes(token))) {
                filters.category = category;
                break;
            }
        }

        // Extract main keywords (exclude common words)
        const stopwords = new Set([
            'find', 'me', 'i', 'want', 'need', 'look', 'for', 'under', 'below', 'above', 'max', 'min',
            'the', 'a', 'an', 'and', 'or', 'is', 'are', 'to', 'in', 'of', 'at', 'by', 'from',
            '₹', 'price', 'cost', 'rupee', 'rupees'
        ]);

        const keywords = stemmedTokens.filter(token => {
            return token.length > 2 && !stopwords.has(token);
        });

        filters.keywords = [...new Set(keywords)];

        // Calculate confidence score based on extracted filters
        let confidence = 0;
        if (filters.keywords.length > 0) confidence += 0.3;
        if (filters.maxPrice !== null) confidence += 0.25;
        if (filters.category !== null) confidence += 0.25;
        if (filters.color !== null) confidence += 0.2;
        filters.confidence = Math.min(confidence, 1);

        logger.debug({ query, filters }, 'Query parsed');
        return filters;
    } catch (error) {
        logger.error(error, 'Error parsing query');
        return {
            keywords: [],
            maxPrice: null,
            minPrice: null,
            category: null,
            color: null,
            size: null,
            sortBy: 'relevance',
            confidence: 0,
        };
    }
};

/**
 * Build search query for Product Service
 */
export const buildSearchQuery = (filters) => {
    const query = {};

    // Full-text search on keywords
    if (filters.keywords && filters.keywords.length > 0) {
        query.q = filters.keywords.join(' ');
    }

    // Category filter
    if (filters.category) {
        query.category = filters.category;
    }

    // Price range filter
    if (filters.maxPrice !== null) {
        query.maxPrice = filters.maxPrice;
    }

    if (filters.minPrice !== null) {
        query.minPrice = filters.minPrice;
    }

    // Color filter (if stored in product data)
    if (filters.color) {
        query.color = filters.color;
    }

    // Sorting
    query.sort = filters.sortBy || 'relevance';
    query.limit = process.env.MAX_PRODUCT_SUGGESTIONS || 5;
    query.page = 1;

    return query;
};

/**
 * Generate natural language response
 */
export const generateResponse = (query, products, totalCount) => {
    if (!products || products.length === 0) {
        return `I couldn't find products matching "${query}". Try searching with different keywords or adjust your price range.`;
    }

    const count = products.length;
    const totalMsg = totalCount > count ? ` (showing top ${count} of ${totalCount})` : '';

    const productList = products
        .slice(0, 3)
        .map(p => `${p.name} - ₹${p.price}`)
        .join(', ');

    return `I found ${totalCount} product${totalCount !== 1 ? 's' : ''} matching your criteria${totalMsg}. Here are some options: ${productList}`;
};

/**
 * Validate AI response quality
 */
export const validateResponse = (filters) => {
    const threshold = parseFloat(process.env.NLP_CONFIDENCE_THRESHOLD || 0.6);
    return filters.confidence >= threshold || (filters.keywords && filters.keywords.length > 0);
};
