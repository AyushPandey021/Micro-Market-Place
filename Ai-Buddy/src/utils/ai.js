import { SearchFiltersSchema } from '../types/searchFilters.js';
import logger from './logger.js';
import natural from 'natural';

/**
 * Keyword-based query parser matching README NLP patterns
 * Colors, Categories, Price ranges, Confidence scoring
 */
export const parseQueryWithAI = async (query) => {
    try {
        const lowerQuery = query.toLowerCase();

        // Define patterns from README
        const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey', 'silver', 'gold'];
        const categories = {
            shoes: ['shoe', 'sneaker', 'boot', 'sandal'],
            shirts: ['shirt', 'tee', 'top'],
            pants: ['pant', 'jean', 'short', 'trouser'],
            watches: ['watch', 'clock'],
            jewelry: ['ring', 'necklace', 'bracelet', 'earring'],
            bags: ['bag', 'backpack', 'suitcase']
        };

        // Price patterns
        const priceMatch = lowerQuery.match(/(\d+(?:\.\d+)?)(k?)(?:\s*(?:to|to|between)\s*(\d+(?:\.\d+)?)(k?))?\s*(?:₹|rupees?|rs?)?/i) ||
            lowerQuery.match(/(?:under|below|max)\s*(\d+(?:\.\d+)?)(k?)/i) ||
            lowerQuery.match(/(?:above|over|min)\s*(\d+(?:\.\d+)?)(k?)/i);

        let minPrice = undefined, maxPrice = undefined;
        if (priceMatch) {
            const [_, lowVal, lowK, highVal, highK] = priceMatch;
            minPrice = parseFloat(lowVal) * (lowK === 'k' ? 1000 : 1);
            if (highVal) maxPrice = parseFloat(highVal) * (highK === 'k' ? 1000 : 1);
            else if (/under|below|max/i.test(lowerQuery)) maxPrice = minPrice;
            else minPrice = minPrice;
        }

        // Extract color
        const color = colors.find(c => lowerQuery.includes(c));

        // Extract category
        let category = null;
        for (const [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(kw => lowerQuery.includes(kw))) {
                category = cat;
                break;
            }
        }

        // Extract keywords (stemmed)
        const tokenizer = new natural.WordTokenizer();
        const stemmedWords = tokenizer.tokenize(lowerQuery)
            .filter(w => w.length > 2)
            .map(w => natural.PorterStemmer.stem(w))
            .filter((w, i, arr) => arr.indexOf(w) === i); // unique

        const keywords = stemmedWords.filter(w => !colors.includes(w) && !Object.values(categories).flat().includes(w));

        // Confidence score
        let confidence = 0.3; // base for keywords
        if (keywords.length > 0) confidence += 0.3;
        if (category) confidence += 0.25;
        if (color) confidence += 0.2;
        if (minPrice !== undefined || maxPrice !== undefined) confidence += 0.25;
        if (confidence < 0.6) confidence = 0.6; // min threshold

        const filters = {
            keywords,
            category,
            minPrice,
            maxPrice,
            color,
            size: undefined, // TODO: implement size parsing
            sortBy: 'relevance',
            limit: 5,
            confidence
        };

        logger.info({ query, filters, confidence }, 'Keyword query parsed');
        return SearchFiltersSchema.parse(filters); // validate
    } catch (error) {
        logger.error(error, 'Keyword parse failed, basic fallback');
        return {
            keywords: query.toLowerCase().split(' ').filter(w => w.length > 2),
        };
    }
};

/**
 * Simple response generator (no AI needed)
 */
export const generateResponseWithAI = async (query, products) => {
    const count = products.length;
    if (count === 0) {
        return `Sorry, no products found for "${query}". Try different keywords!`;
    }

    const topProducts = products.slice(0, 3).map(p => `${p.name} - ₹${p.price}`).join(', ');
    return `Found ${count} matching products! Top options: ${topProducts}. ${count > 3 ? `Showing top ${products.length}.` : ''}`;
};

