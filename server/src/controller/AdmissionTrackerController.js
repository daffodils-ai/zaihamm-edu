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
                gender,
                dateOfBirth,
                class: studentClass,
                classId,
                sectionId,
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
                fullAddress,
                previousSchool
            } = req.body;

            const normalizedFullName = `${fullName || ''}`.trim();
            const normalizedClass = `${studentClass || ''}`.trim();
            const normalizedParentMobile = `${parentMobile || ''}`.trim();
            const normalizedFatherName = `${fatherName || ''}`.trim();
            const normalizedMotherName = `${motherName || ''}`.trim();
            const normalizedAadharNo = `${aadharNo || ''}`.trim();
            const normalizedParentAadharNumber = `${parentAadharNumber || ''}`.trim();
            const normalizedRelation = `${parentAadharRelation || ''}`.trim();
            const normalizedAddress = `${fullAddress || ''}`.trim();
            const parsedDob = dateOfBirth ? new Date(dateOfBirth) : null;
            const derivedAge = parsedDob && !Number.isNaN(parsedDob.getTime())
                ? this.calculateAgeFromDob(parsedDob)
                : null;
            const normalizedAge = Number.isFinite(Number(age))
                ? Number(age)
                : derivedAge;

            // Validate required fields
            if (
                !normalizedFullName ||
                normalizedAge === null ||
                Number.isNaN(normalizedAge) ||
                !normalizedClass ||
                !normalizedParentMobile ||
                !normalizedFatherName ||
                !normalizedMotherName ||
                !normalizedAadharNo ||
                !normalizedParentAadharNumber ||
                !normalizedRelation ||
                !normalizedAddress
            ) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            // Validate age
            if (normalizedAge < 0 || normalizedAge > 150) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid age');
            }

            if (gender && !['male', 'female', 'other'].includes(gender)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid gender');
            }

            // Validate parent Aadhar relation
            const allowedRelations = ['father', 'mother', 'brother', 'sister', 'other'];
            if (!allowedRelations.includes(normalizedRelation)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid parent Aadhar relation');
            }

            const admission = await AdmissionTrackerService.create({
                fullName: normalizedFullName,
                age: normalizedAge,
                gender,
                dateOfBirth,
                class: normalizedClass,
                classId,
                sectionId,
                bloodGroup,
                mobile,
                parentMobile: normalizedParentMobile,
                studentEmail,
                parentEmail,
                fatherName: normalizedFatherName,
                motherName: normalizedMotherName,
                guardianName,
                aadharNo: normalizedAadharNo,
                parentAadharNumber: normalizedParentAadharNumber,
                parentAadharRelation: normalizedRelation,
                fullAddress: normalizedAddress,
                previousSchool
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

            if (updateData.gender && !['male', 'female', 'other'].includes(updateData.gender)) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid gender');
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

    calculateAgeFromDob(dateOfBirth) {
        const today = new Date();
        let age = today.getUTCFullYear() - dateOfBirth.getUTCFullYear();
        const monthDiff = today.getUTCMonth() - dateOfBirth.getUTCMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < dateOfBirth.getUTCDate())) {
            age -= 1;
        }

        return Math.max(age, 0);
    }
}

export default new AdmissionTrackerController();
