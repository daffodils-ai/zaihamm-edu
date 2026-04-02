import SubjectService from '../service/SubjectService.js';
import { HTTP_CODES, SUCCESS_MESSAGES } from '../constants/index.js';

class SubjectController {
    async create(req, res, next) {
        try {
            const subject = await SubjectService.create(req.user.organizationId, req.body);
            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data: subject
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await SubjectService.getAll(req.user.organizationId, filters, page, limit);
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

    async getAvailable(req, res, next) {
        try {
            const data = await SubjectService.getAvailable(req.user.organizationId, req.query.classId || null);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const subject = await SubjectService.getById(req.params.id);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: subject
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const subject = await SubjectService.update(req.params.id, req.user.organizationId, req.body);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: subject
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await SubjectService.delete(req.params.id, req.user.organizationId);
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

export default new SubjectController();
