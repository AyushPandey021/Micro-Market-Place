import { body, query, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

/**
 * Validate query request body
 */
export const validateQueryRequest = [
    body('query')
        .trim()
        .notEmpty()
        .withMessage('Query is required')
        .isLength({ min: 3, max: 500 })
        .withMessage('Query must be between 3 and 500 characters'),
    body('autoAddToCart')
        .optional()
        .isBoolean()
        .withMessage('autoAddToCart must be a boolean'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({ errors: errors.array() }, 'Validation errors');
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        next();
    },
];

/**
 * Validate add to cart request
 */
export const validateAddToCartRequest = [
    body('productIds')
        .isArray()
        .withMessage('productIds must be an array'),
    body('productIds.*')
        .trim()
        .notEmpty()
        .withMessage('Each productId must be provided'),
    body('quantities')
        .optional()
        .isObject()
        .withMessage('quantities must be an object'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({ errors: errors.array() }, 'Validation errors');
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        next();
    },
];

/**
 * Validate add single product request
 */
export const validateAddSingleProductRequest = [
    body('productId')
        .trim()
        .notEmpty()
        .withMessage('productId is required'),
    body('quantity')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Quantity must be between 1 and 100'),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn({ errors: errors.array() }, 'Validation errors');
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        next();
    },
];
