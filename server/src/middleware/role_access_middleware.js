import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Middleware to check role-based access control
 * @param {Array} allowedRoles - Array of allowed roles
 */
export const roleAccessMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new ApiError(
                    HTTP_CODES.UNAUTHORIZED,
                    ERROR_MESSAGES.UNAUTHORIZED
                );
            }

            if (!allowedRoles.includes(req.user.role)) {
                Logger.log(
                    `Access denied for user ${req.user.id} with role ${req.user.role}`,
                    Logger.Level.WARN
                );
                throw new ApiError(
                    HTTP_CODES.FORBIDDEN,
                    ERROR_MESSAGES.FORBIDDEN
                );
            }

            next();
        } catch (error) {
            Logger.log(`Role access middleware error: ${error.message}`, Logger.Level.WARN);
            const statusCode = error.statusCode || HTTP_CODES.FORBIDDEN;
            const message = error.message || ERROR_MESSAGES.FORBIDDEN;
            res.status(statusCode).json({
                success: false,
                statusCode,
                message
            });
        }
    };
};

/**
 * Middleware to check role-based access control for students
 * @param {Array} allowedRoles - Array of allowed roles (not used for students, but for consistency)
 */
export const studentRoleAccessMiddleware = () => {
    return (req, res, next) => {
        try {
            if (!req.student) {
                throw new ApiError(
                    HTTP_CODES.UNAUTHORIZED,
                    ERROR_MESSAGES.UNAUTHORIZED
                );
            }

            next();
        } catch (error) {
            Logger.log(`Student role access middleware error: ${error.message}`, Logger.Level.WARN);
            const statusCode = error.statusCode || HTTP_CODES.UNAUTHORIZED;
            const message = error.message || ERROR_MESSAGES.UNAUTHORIZED;
            res.status(statusCode).json({
                success: false,
                statusCode,
                message
            });
        }
    };
};
