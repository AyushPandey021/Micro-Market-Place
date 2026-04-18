import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

export const validateCreateRazorpayOrder = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isString().withMessage('Currency must be a string'),
    body('receipt').optional().isString().withMessage('Receipt must be a string'),
    validate
];

export const validateVerifyPayment = [
    body('paymentId').isString().notEmpty().withMessage('Payment ID is required'),
    body('orderId').isString().notEmpty().withMessage('Order ID is required'),
    body('signature').isString().notEmpty().withMessage('Signature is required'),
    validate
];

export const validatePaymentId = [
    param('id').isString().notEmpty().withMessage('Payment ID is required'),
    validate
];