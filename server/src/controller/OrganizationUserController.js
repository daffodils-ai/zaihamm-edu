import OrganizationUserService from '../service/OrganizationUserService.js';
import { ApiError, formatErrorResponse } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Controller for Organization User operations
 */
class OrganizationUserController {
    async create(req, res, next) {
        try {
            const { firstName, lastName, email, mobile, password, role, organizationId } = req.body;

            if (!firstName || !lastName || !email || !mobile || !password || !role) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const user = await OrganizationUserService.createUser({
                organizationId: req.user.organizationId || organizationId,
                firstName,
                lastName,
                email,
                mobile,
                password,
                role
            });

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password, organizationId } = req.body;

            if (!email || !password) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            // organizationId is optional for backward compatibility
            const result = await OrganizationUserService.login(email, password, organizationId);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await OrganizationUserService.getUserById(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await OrganizationUserService.getAllUsers(
                req.user.organizationId,
                filters,
                page,
                limit
            );

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    pages: Math.ceil(result.total / result.limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const user = await OrganizationUserService.updateUser(id, req.body);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await OrganizationUserService.deleteUser(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.DELETED,
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { userId, newPassword } = req.body;

            if (!userId || !newPassword) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const result = await OrganizationUserService.resetPassword(userId, newPassword);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrganizationUserController();
