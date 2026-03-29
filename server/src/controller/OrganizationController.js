import OrganizationService from '../service/OrganizationService.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Controller for Organization operations
 */
class OrganizationController {
    /**
     * Signup new organization with admin user
     */
    async signup(req, res, next) {
        try {
            const {
                name,
                email,
                mobile,
                address,
                firstName,
                lastName,
                adminEmail,
                adminPassword,
                adminMobile
            } = req.body;

            // Validate required fields
            if (!name || !email || !mobile || !address || !firstName || !lastName || !adminEmail || !adminPassword) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const result = await OrganizationService.signupOrganization({
                name,
                email,
                mobile,
                address,
                firstName,
                lastName,
                adminEmail,
                adminPassword,
                adminMobile
            });

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: 'Organization and admin user created successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get organization by ID
     */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const organization = await OrganizationService.getOrganizationById(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: organization
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all organizations
     */
    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await OrganizationService.getAllOrganizations(filters, page, limit);

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

    /**
     * Update organization
     */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const organization = await OrganizationService.updateOrganization(id, req.body);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: organization
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete organization
     */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await OrganizationService.deleteOrganization(id);

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
}

export default new OrganizationController();
