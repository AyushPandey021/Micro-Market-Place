import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

/**
 * Verify JWT token
 */
export const verifyToken = (req, res, next) => {
    try {
        let token;

        // Priority 1: Authorization header
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
            logger.debug('Token from header');
        }
        // Priority 2: cookie.token
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            logger.debug('Token from cookie');
        } else {
            logger.warn('No token found in header or cookie');
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Login first.',
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
            if (err) {
                logger.warn({ error: err.message }, 'Token verification failed');
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token',
                });
            }

            req.user = user;
            req.token = token;
            next();
        });
    } catch (error) {
        logger.error(error, 'Auth middleware error');
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

/**
 * Optional token verification (doesn't fail if no token)
 */
export const optionalVerifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
                if (!err) {
                    req.user = user;
                    req.token = token;
                } else {
                    logger.warn({ error: err.message }, 'Optional token verification failed');
                }
            });
        }

        next();
    } catch (error) {
        logger.error(error, 'Optional auth middleware error');
        next();
    }
};
