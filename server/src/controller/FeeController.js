import FeeService from '../service/FeeService.js';
import { ApiError } from '../utils/error.js';
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    HTTP_CODES,
    ALLOWED_ROLES_TO_ADMIT_STUDENT,
    FEE_STATUS
} from '../constants/index.js';

/**
 * Controller for Fee operations
 */
class FeeController {
    async create(req, res, next) {
        try {
            if (!ALLOWED_ROLES_TO_ADMIT_STUDENT.includes(req.user.role)) {
                throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
            }

            const { studentId, studentSessionId, classId, type, amount, dueDate, status, remarks } = req.body;

            if (!studentId || !studentSessionId || !classId || !type || !amount || !dueDate) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            if (status && ![FEE_STATUS.PAID, FEE_STATUS.PENDING].includes(status)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const fee = await FeeService.create({
                organizationId: req.user.organizationId,
                studentId,
                studentSessionId,
                classId,
                type,
                amount,
                dueDate,
                status: status || FEE_STATUS.PENDING,
                remarks
            });

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data: fee
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const fee = await FeeService.getById(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: fee
            });
        } catch (error) {
            next(error);
        }
    }

    async getByStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const result = await FeeService.getByStudent(
                studentId,
                req.user.organizationId,
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

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await FeeService.getAll(
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
            const fee = await FeeService.update(id, req.body);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: fee
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await FeeService.delete(id);

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

    async payFee(req, res, next) {
        try {
            const { id } = req.params;
            const fee = await FeeService.payFee(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: 'Fee paid successfully',
                data: fee
            });
        } catch (error) {
            next(error);
        }
    }

    async generateMonthlyFees(req, res, next) {
        try {
            if (!ALLOWED_ROLES_TO_ADMIT_STUDENT.includes(req.user.role)) {
                throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
            }

            const { amount, dueDate } = req.body;

            if (!amount || !dueDate) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const result = await FeeService.generateMonthlyFees(
                req.user.organizationId,
                amount,
                dueDate
            );

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: result.message,
                data: {}
            });
        } catch (error) {
            next(error);
        }
    }

    async getPendingFees(req, res, next) {
        try {
            const fees = await FeeService.getPendingFees(req.user.organizationId);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: fees
            });
        } catch (error) {
            next(error);
        }
    }

    async getOverdueFees(req, res, next) {
        try {
            const fees = await FeeService.getOverdueFees(req.user.organizationId);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: fees
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new FeeController();
