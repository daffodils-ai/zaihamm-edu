import AdmissionTrackerService from '../service/AdmissionTrackerService.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Controller for AdmissionTracker operations
 */
class AdmissionTrackerController {
    async create(req, res, next) {
        try {
            const {
                fullName,
                age,
                bloodGroup,
                mobile,
                parentMobile,
                studentEmail,
                parentEmail,
                fatherName,
                motherName,
                guardianName,
                aadharNo,
                parentAadharNumber,
                parentAadharRelation,
                fullAddress
            } = req.body;

            // Validate required fields
            if (!fullName || !age || !parentMobile || !fatherName || !motherName || !aadharNo || !parentAadharNumber || !parentAadharRelation || !fullAddress) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            // Validate age
            if (typeof age !== 'number' || age < 0 || age > 150) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid age');
            }

            // Validate parent Aadhar relation
            const allowedRelations = ['father', 'mother', 'brother', 'sister', 'other'];
            if (!allowedRelations.includes(parentAadharRelation)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid parent Aadhar relation');
            }

            const admission = await AdmissionTrackerService.create({
                fullName,
                age,
                bloodGroup,
                mobile,
                parentMobile,
                studentEmail,
                parentEmail,
                fatherName,
                motherName,
                guardianName,
                aadharNo,
                parentAadharNumber,
                parentAadharRelation,
                fullAddress
            });

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data: admission
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const admission = await AdmissionTrackerService.getById(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: admission
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await AdmissionTrackerService.getAll(filters, page, limit);

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
            const updateData = { ...req.body };

            // Remove immutable fields from update
            delete updateData._id;
            delete updateData.createdAt;

            // Validate parent Aadhar relation if provided
            if (updateData.parentAadharRelation) {
                const allowedRelations = ['father', 'mother', 'brother', 'sister', 'other'];
                if (!allowedRelations.includes(updateData.parentAadharRelation)) {
                    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid parent Aadhar relation');
                }
            }

            // Validate age if provided
            if (updateData.age !== undefined) {
                if (typeof updateData.age !== 'number' || updateData.age < 0 || updateData.age > 150) {
                    throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid age');
                }
            }

            const admission = await AdmissionTrackerService.update(id, updateData);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: admission
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await AdmissionTrackerService.delete(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.DELETED
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdmissionTrackerController();
