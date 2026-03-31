import NoticeBoardService from '../service/NoticeBoardService.js';
import { ApiError } from '../utils/error.js';
import {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    HTTP_CODES,
    ALLOWED_ROLES_TO_CREATE_NOTICE,
    NOTICE_TYPES
} from '../constants/index.js';

/**
 * Controller for NoticeBoard operations
 */
class NoticeBoardController {
    async create(req, res, next) {
        try {
            if (!ALLOWED_ROLES_TO_CREATE_NOTICE.includes(req.user.role)) {
                throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
            }

            const { title, description, noticeType, fromDate, toDate, attachments } = req.body;

            if (!title || !description || !noticeType || !fromDate || !toDate) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            if (!Object.values(NOTICE_TYPES).includes(noticeType)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const parsedFromDate = new Date(fromDate);
            const parsedToDate = new Date(toDate);

            if (Number.isNaN(parsedFromDate.getTime()) || Number.isNaN(parsedToDate.getTime()) || parsedFromDate > parsedToDate) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const notice = await NoticeBoardService.create({
                organizationId: req.user.organizationId,
                createdBy: req.user.id,
                title,
                description,
                noticeType,
                fromDate: parsedFromDate,
                toDate: parsedToDate,
                attachments: attachments || []
            });

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data: notice
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const notice = await NoticeBoardService.getById(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: notice
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await NoticeBoardService.getAll(
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

    async getRecentNotices(req, res, next) {
        try {
            const notices = await NoticeBoardService.getRecentNotices(req.user.organizationId);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: notices
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { noticeType, fromDate, toDate } = req.body;

            if (noticeType && !Object.values(NOTICE_TYPES).includes(noticeType)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            if (fromDate || toDate) {
                const parsedFromDate = fromDate ? new Date(fromDate) : null;
                const parsedToDate = toDate ? new Date(toDate) : null;

                if ((parsedFromDate && Number.isNaN(parsedFromDate.getTime())) || (parsedToDate && Number.isNaN(parsedToDate.getTime()))) {
                    throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
                }

                if (parsedFromDate && parsedToDate && parsedFromDate > parsedToDate) {
                    throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
                }
            }

            const notice = await NoticeBoardService.update(id, req.body);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: notice
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await NoticeBoardService.delete(id);

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

export default new NoticeBoardController();
