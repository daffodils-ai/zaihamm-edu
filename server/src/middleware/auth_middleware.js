import { verifyToken } from '../utils/index.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Middleware to verify JWT token
 */
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ApiError(
                HTTP_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.UNAUTHORIZED
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            throw new ApiError(
                HTTP_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.TOKEN_EXPIRED
            );
        }

        req.user = decoded;
        next();
    } catch (error) {
        Logger.log(`Auth middleware error: ${error.message}`, Logger.Level.WARN);
        const statusCode = error.statusCode || HTTP_CODES.UNAUTHORIZED;
        const message = error.message || ERROR_MESSAGES.UNAUTHORIZED;
        res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
    }
};

/**
 * Middleware to verify Student JWT token
 */
export const studentAuthMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ApiError(
                HTTP_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.UNAUTHORIZED
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            throw new ApiError(
                HTTP_CODES.UNAUTHORIZED,
                ERROR_MESSAGES.TOKEN_EXPIRED
            );
        }

        req.student = decoded;
        next();
    } catch (error) {
        Logger.log(`Student auth middleware error: ${error.message}`, Logger.Level.WARN);
        const statusCode = error.statusCode || HTTP_CODES.UNAUTHORIZED;
        const message = error.message || ERROR_MESSAGES.UNAUTHORIZED;
        res.status(statusCode).json({
            success: false,
            statusCode,
            message
        });
    }
};
