import StudentService from '../service/StudentService.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES, ALLOWED_ROLES_TO_ADMIT_STUDENT } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Controller for Student operations
 */
class StudentController {
    async admit(req, res, next) {
        try {
            if (!ALLOWED_ROLES_TO_ADMIT_STUDENT.includes(req.user.role)) {
                throw new ApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
            }

            const {
                fullName, age, bloodGroup, mobile, parentMobile, studentEmail, parentEmail,
                fatherName, motherName, guardianName, aadharNo, parentAadharNumber,
                parentAadharRelation, fullAddress, parentPic, studentPic, gender
            } = req.body;

            if (!fullName || !age || !parentMobile || !fatherName || !motherName || !aadharNo || !parentAadharNumber || !parentAadharRelation || !fullAddress) {
                throw new ApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.INVALID_REQUEST);
            }

            const student = await StudentService.admitStudent({
                organizationId: req.user.organizationId,
                fullName,
                age,
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
            });

            const { classId, sectionId, year } = req.body;
            if (classId && year) {
                const session = await StudentService.createStudentSession({
                    organizationId: req.user.organizationId,
                    studentId: student._id,
                    classId,
                    sectionId: sectionId || null,
                    year,
                    registrationNumber: student.registrationNumber
                });

                res.status(HTTP_CODES.CREATED).json({
                    success: true,
                    statusCode: HTTP_CODES.CREATED,
                    message: SUCCESS_MESSAGES.CREATED,
                    data: {
                        student,
                        session: session.session,
                        credentials: {
                            registrationNumber: session.registrationNumber,
                            password: session.password
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
