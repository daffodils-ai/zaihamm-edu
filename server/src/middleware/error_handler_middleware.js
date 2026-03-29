import { ApiError, formatErrorResponse } from '../utils/error.js';
import { Logger } from '../logger/logger.js';
import { HTTP_CODES, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Centralized error handling middleware
 */
export const errorHandlerMiddleware = (err, req, res, next) => {
    Logger.log(`Error: ${err.message}`, Logger.Level.ERROR);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(formatErrorResponse(err));
    }

    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            const apiError = new ApiError(
                HTTP_CODES.CONFLICT,
                `${field} already exists`,
                { field }
            );
            return res.status(apiError.statusCode).json(formatErrorResponse(apiError));
        }
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        const apiError = new ApiError(
            HTTP_CODES.BAD_REQUEST,
            ERROR_MESSAGES.VALIDATION_ERROR,
            messages
        );
        return res.status(apiError.statusCode).json(formatErrorResponse(apiError));
    }

    if (err.name === 'CastError') {
        const apiError = new ApiError(
            HTTP_CODES.BAD_REQUEST,
            ERROR_MESSAGES.INVALID_REQUEST
        );
        return res.status(apiError.statusCode).json(formatErrorResponse(apiError));
    }

    // Default error response
    const apiError = new ApiError(
        HTTP_CODES.INTERNAL_ERROR,
        err.message || ERROR_MESSAGES.INTERNAL_ERROR
    );
    res.status(apiError.statusCode).json(formatErrorResponse(apiError));
};

/**
 * 404 Not Found handler
 */
export const notFoundMiddleware = (req, res, next) => {
    const apiError = new ApiError(
        HTTP_CODES.NOT_FOUND,
        `Route ${req.originalUrl} not found`
    );
    res.status(apiError.statusCode).json(formatErrorResponse(apiError));
};
