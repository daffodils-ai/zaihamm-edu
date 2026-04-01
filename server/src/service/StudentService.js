import StudentRepository from '../repository/StudentRepository.js';
import StudentSessionRepository from '../repository/StudentSessionRepository.js';
import NotificationRepository from '../repository/NotificationRepository.js';
import { hashPassword, generatePassword, generateRegistrationNumber, generateToken } from '../utils/index.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES, STUDENT_STATUS } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Student operations
 */
class StudentService {
    async enrichStudentWithLatestSession(student) {
        if (!student) return null;

        const latestSession = await StudentSessionRepository.findLatestByStudent(student._id);
        const studentObject = typeof student.toObject === 'function' ? student.toObject() : { ...student };

        return {
            ...studentObject,
            class: latestSession?.classId || null,
            section: latestSession?.sectionId || null,
            year: latestSession?.year || null,
            latestSession
        };
    }

    /**
     * Admit new student
     */
    async admitStudent(data) {
        try {
            // Check if student already exists with same Aadhar
            const existingStudent = await StudentRepository.findByAadhar(
                data.aadharNo,
                data.organizationId
            );
            if (existingStudent) {
                throw new ApiError(HTTP_CODES.CONFLICT, 'Student with this Aadhar already exists');
            }

            // Generate registration number
            const registrationNumber = generateRegistrationNumber();
            data.registrationNumber = registrationNumber;

            // Create student
            const student = await StudentRepository.create(data);
            Logger.log(`Student admitted: ${registrationNumber}`, Logger.Level.INFO);
            return student;
        } catch (error) {
            Logger.log(`Error admitting student: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Create student session (on admission or promotion)
     */
    async createStudentSession(data) {
        try {
            // Generate password and hash it
            const password = generatePassword();
            const hashedPassword = await hashPassword(password);

            const sessionData = {
                ...data,
                registrationNumber: data.registrationNumber || generateRegistrationNumber(),
                defaultPassword: hashedPassword
            };

            const session = await StudentSessionRepository.create(sessionData);
            Logger.log(`Student session created for student: ${data.studentId}`, Logger.Level.INFO);

            return {
                session,
                password, // Return plain password to send to student
                registrationNumber: sessionData.registrationNumber
            };
        } catch (error) {
            Logger.log(`Error creating student session: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Student login
     */
    async studentLogin(registrationNumber, password) {
        try {
            const student = await StudentRepository.findByRegistrationNumber(registrationNumber);
            if (!student) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const session = await StudentSessionRepository.findLatestByStudent(student._id);
            if (!session) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const isPasswordValid = await hashPassword(password) === session.defaultPassword;
            if (!isPasswordValid) {
                throw new ApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
            }

            const token = generateToken({
                id: student._id,
                registrationNumber: student.registrationNumber,
                fullName: student.fullName,
                organizationId: student.organizationId
            });

            Logger.log(`Student logged in: ${registrationNumber}`, Logger.Level.INFO);
            return {
                token,
                student: {
                    id: student._id,
                    fullName: student.fullName,
                    registrationNumber: student.registrationNumber,
                    class: session.classId,
                    section: session.sectionId
                }
            };
        } catch (error) {
            Logger.log(`Error logging in student: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get student by ID
     */
    async getStudentById(id) {
        try {
            const student = await StudentRepository.findById(id);
            if (!student) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.STUDENT_NOT_FOUND);
            }
            return await this.enrichStudentWithLatestSession(student);
        } catch (error) {
            Logger.log(`Error fetching student: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get all students for organization
     */
    async getAllStudents(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            const result = await StudentRepository.findAll(organizationId, filters, page, limit);
            const data = await Promise.all(
                result.data.map((student) => this.enrichStudentWithLatestSession(student))
            );

            return {
                ...result,
                data
            };
        } catch (error) {
            Logger.log(`Error fetching students: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Update student
     */
    async updateStudent(id, data) {
        try {
            const student = await StudentRepository.update(id, data);
            if (!student) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.STUDENT_NOT_FOUND);
            }
            Logger.log(`Student updated: ${id}`, Logger.Level.INFO);
            return student;
        } catch (error) {
            Logger.log(`Error updating student: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Delete student
     */
    async deleteStudent(id) {
        try {
            const student = await StudentRepository.delete(id);
            if (!student) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.STUDENT_NOT_FOUND);
            }
            Logger.log(`Student deleted: ${id}`, Logger.Level.INFO);
            return student;
        } catch (error) {
            Logger.log(`Error deleting student: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Promote student to next year
     */
    async promoteStudent(studentId, organizationId, newYear, classId, sectionId) {
        try {
            const student = await this.getStudentById(studentId);
            
            // Create new session for next year
            const sessionData = {
                organizationId,
                studentId,
                classId,
                sectionId,
                year: newYear,
                registrationNumber: student.registrationNumber
            };

            const result = await this.createStudentSession(sessionData);
            Logger.log(`Student promoted to next year: ${studentId}`, Logger.Level.INFO);
            return result;
        } catch (error) {
            Logger.log(`Error promoting student: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get student session history
     */
    async getStudentHistory(studentId, organizationId, page = 1, limit = 10) {
        try {
            return await StudentSessionRepository.findHistoryByStudent(studentId, organizationId, page, limit);
        } catch (error) {
            Logger.log(`Error fetching student history: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    /**
     * Get latest student session
     */
    async getLatestSession(studentId) {
        try {
            const session = await StudentSessionRepository.findLatestByStudent(studentId);
            if (!session) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'No session found for student');
            }
            return session;
        } catch (error) {
            Logger.log(`Error fetching latest session: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new StudentService();
