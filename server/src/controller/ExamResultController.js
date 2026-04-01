import ExamResultService from '../service/ExamResultService.js';
import { ApiError } from '../utils/error.js';
import {
    ALLOWED_ROLES_TO_ADMIT_STUDENT,
    ERROR_MESSAGES,
    HTTP_CODES,
    SUCCESS_MESSAGES
} from '../constants/index.js';

class ExamResultController {
    ensureRole(req) {
        if (!ALLOWED_ROLES_TO_ADMIT_STUDENT.includes(req.user.role)) {
            throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
        }
    }

    async create(req, res, next) {
        try {
            this.ensureRole(req);
            const result = await ExamResultService.create({
                ...req.body,
                organizationId: req.user.organizationId
            });

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await ExamResultService.getAll(req.user.organizationId, filters, page, limit);

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

    async getById(req, res, next) {
        try {
            const result = await ExamResultService.getById(req.params.id);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            this.ensureRole(req);
            const result = await ExamResultService.update(req.params.id, req.body);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            this.ensureRole(req);
            await ExamResultService.delete(req.params.id);
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

    async finalize(req, res, next) {
        try {
            this.ensureRole(req);
            const result = await ExamResultService.finalize(req.params.id);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: 'Result finalized successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async downloadPdf(req, res, next) {
        try {
            const result = await ExamResultService.getById(req.params.id);
            const pdfBuffer = await ExamResultService.generatePdf(req.params.id);
            const safeName = `${result.examName}-${result.studentId?.registrationNumber || result._id}`
                .replace(/[^a-z0-9-_]+/gi, '-')
                .toLowerCase();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
            res.status(HTTP_CODES.OK).send(pdfBuffer);
        } catch (error) {
            next(error);
        }
    }
}

export default new ExamResultController();
