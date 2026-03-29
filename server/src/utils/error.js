/**
 * Custom API Error class
 */
export class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Error response formatter
 */
export const formatErrorResponse = (error) => {
    return {
        success: false,
        statusCode: error.statusCode || 500,
        message: error.message,
        ...(error.details && { details: error.details }),
        timestamp: error.timestamp || new Date().toISOString()
    };
};

/**
 * Get HTTP status text
 */
export const getHttpStatusText = (statusCode) => {
    const statusTexts = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error'
    };
    return statusTexts[statusCode] || 'Unknown';
};
