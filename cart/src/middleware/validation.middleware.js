import { body, param, validationResult } from 'express-validator';

export const validateAddToCart = [
    body('productId')
        .isString()
        .notEmpty()
        .withMessage('Product ID is required'),

    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

export const validateUpdateQuantity = [
    param('productId')
        .isString()
        .notEmpty()
        .withMessage('Product ID is required'),

    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be 0 or more'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];