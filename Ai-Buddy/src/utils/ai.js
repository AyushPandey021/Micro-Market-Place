import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';
import { SearchFiltersSchema } from '../types/searchFilters.js';
import logger from './logger.js';

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    temperature: 0,
});

export const parseQueryWithAI = async (query) => {
    try {
        const prompt = `Parse this shopping query into structured search filters: "${query}"
    
Valid categories: shoes, shirt, pant, watch, jewelry, bag
Colors: red, blue, green, yellow, black, white, pink, purple, orange, brown, gray, silver, gold

Return ONLY valid JSON matching this schema:
${SearchFiltersSchema.safeParse({}).error?.message || '{}'}

Example: "red shoes under 2000" -> {"keywords":["shoes"],"color":"red","maxPrice":2000}`;

        const chain = model.withStructuredOutput(SearchFiltersSchema);
        const filters = await chain.invoke(prompt);

        logger.info({ query, filters }, 'AI query parsed');
        return filters;
    } catch (error) {
        logger.error(error, 'AI parse failed, fallback to keywords');
        // Fallback to simple keywords
        return {
            keywords: query.toLowerCase().split(' ').filter(w => w.length > 2),
        };
    }
};

export const generateResponseWithAI = async (query, products) => {
    try {
        const prompt = `Generate helpful shopping response for query "${query}" based on these products: ${JSON.stringify(products.slice(0, 3))}`;
        const response = await model.invoke(prompt);
        return response.content;
    } catch (error) {
        logger.error(error, 'AI response generation failed');
        return `Found ${products.length} matching products!`;
    }
};

