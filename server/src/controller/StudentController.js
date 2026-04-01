import StudentService from '../service/StudentService.js';
import AdmissionTrackerService from '../service/AdmissionTrackerService.js';
import FeeService from '../service/FeeService.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES, ALLOWED_ROLES_TO_ADMIT_STUDENT, FEE_STATUS, FEE_TYPES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';
import mongoose from 'mongoose';

/**
 * Controller for Student operations
 */
class StudentController {
    calculateAgeFromDob(dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        const today = new Date();
        const diffMs = today.getTime() - parsedDate.getTime();
        const yearMs = 365.2425 * 24 * 60 * 60 * 1000;

        return Math.max(Math.floor(diffMs / yearMs), 0);
    }

    async admit(req, res, next) {
        try {
            if (!ALLOWED_ROLES_TO_ADMIT_STUDENT.includes(req.user.role)) {
                throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
            }

            const {
                fullName, age, dateOfBirth, bloodGroup, mobile, parentMobile, studentEmail, parentEmail,
                fatherName, motherName, guardianName, aadharNo, parentAadharNumber,
                parentAadharRelation, fullAddress, parentPic, studentPic, gender
            } = req.body;

            const normalizedAge = dateOfBirth ? this.calculateAgeFromDob(dateOfBirth) : Number(age);

            if (!fullName || (!dateOfBirth && !age) || !parentMobile || !fatherName || !motherName || !aadharNo || !parentAadharNumber || !parentAadharRelation || !fullAddress) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            if (!Number.isFinite(normalizedAge) || normalizedAge < 0) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, 'Invalid age/date of birth');
            }

            const { classId, sectionId, year, admissionTrackerId, admissionFeeAmount, admissionFeeDueDate, feeRemarks } = req.body;
            const dbSession = await mongoose.startSession();

            try {
                let student;
                let sessionResult = null;

                await dbSession.withTransaction(async () => {
                    student = await StudentService.admitStudent({
                        organizationId: req.user.organizationId,
                        fullName,
                        age: normalizedAge,
                        dateOfBirth: dateOfBirth || null,
                        gender,
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
                        parentPic,
                        studentPic
                    }, { session: dbSession });

                    if (classId && year) {
                        sessionResult = await StudentService.createStudentSession({
                            organizationId: req.user.organizationId,
                            studentId: student._id,
                            classId,
                            sectionId: sectionId || null,
                            year,
                            registrationNumber: student.registrationNumber
                        }, { session: dbSession });

                        if (admissionFeeAmount !== undefined && admissionFeeAmount !== null && admissionFeeAmount !== '') {
                            await FeeService.create({
                                organizationId: req.user.organizationId,
                                studentId: student._id,
                                studentSessionId: sessionResult.session._id,
                                classId,
                                sectionId: sectionId || null,
                                type: FEE_TYPES.ADMISSION,
                                amount: Number(admissionFeeAmount),
                                dueDate: admissionFeeDueDate || new Date().toISOString().slice(0, 10),
                                status: FEE_STATUS.PENDING,
                                remarks: feeRemarks || 'Admission fee'
                            }, { session: dbSession });
                        }
                    }

                    if (admissionTrackerId) {
                        await AdmissionTrackerService.delete(admissionTrackerId, { session: dbSession });
                    }
                });

                if (sessionResult) {
                    res.status(HTTP_CODES.CREATED).json({
                        success: true,
                        statusCode: HTTP_CODES.CREATED,
                        message: SUCCESS_MESSAGES.CREATED,
                        data: {
                            student,
                            session: sessionResult.session,
                            credentials: {
                                registrationNumber: sessionResult.registrationNumber,
                                password: sessionResult.password
                            }
                        }
                    });
                } else {
                    res.status(HTTP_CODES.CREATED).json({
                        success: true,
                        statusCode: HTTP_CODES.CREATED,
                        message: SUCCESS_MESSAGES.CREATED,
                        data: { student }
                    });
                }
            } finally {
                await dbSession.endSession();
            }
        } catch (error) {
            next(error);
        }
    }

    async studentLogin(req, res, next) {
        try {
            const { registrationNumber, password } = req.body;

            if (!registrationNumber || !password) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const result = await StudentService.studentLogin(registrationNumber, password);

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
            const student = await StudentService.getStudentById(id);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await StudentService.getAllStudents(
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
            const student = await StudentService.updateStudent(id, req.body);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.UPDATED,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await StudentService.deleteStudent(id);

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

    async promoteStudent(req, res, next) {
        try {
            if (!ALLOWED_ROLES_TO_ADMIT_STUDENT.includes(req.user.role)) {
                throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
            }

            const { studentId, newYear, classId, sectionId } = req.body;

            if (!studentId || !newYear || !classId || !sectionId) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const result = await StudentService.promoteStudent(
                studentId,
                req.user.organizationId,
                newYear,
                classId,
                sectionId
            );

            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: 'Student promoted successfully',
                data: {
                    session: result.session,
                    credentials: {
                        registrationNumber: result.registrationNumber,
                        password: result.password
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getStudentHistory(req, res, next) {
        try {
            const { studentId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const result = await StudentService.getStudentHistory(
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

    async getLatestSession(req, res, next) {
        try {
            const { studentId } = req.params;
            const session = await StudentService.getLatestSession(studentId);

            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: session
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new StudentController();
