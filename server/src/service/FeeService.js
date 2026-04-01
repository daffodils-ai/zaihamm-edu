import FeeRepository from '../repository/FeeRepository.js';
import StudentSessionRepository from '../repository/StudentSessionRepository.js';
import NotificationRepository from '../repository/NotificationRepository.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES, FEE_STATUS, FEE_TYPES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Fee operations
 */
class FeeService {
    async create(data, options = {}) {
        try {
            const fee = await FeeRepository.create(data, options);
            Logger.log(`Fee created for student: ${data.studentId}`, Logger.Level.INFO);
            return fee;
        } catch (error) {
            Logger.log(`Error creating fee: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const fee = await FeeRepository.findById(id);
            if (!fee) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Fee not found');
            }
            return fee;
        } catch (error) {
            Logger.log(`Error fetching fee: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getByStudent(studentId, organizationId, page = 1, limit = 10) {
        try {
            return await FeeRepository.findByStudent(studentId, organizationId, page, limit);
        } catch (error) {
            Logger.log(`Error fetching student fees: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await FeeRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching fees: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const fee = await FeeRepository.update(id, data);
            if (!fee) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Fee not found');
            }
            Logger.log(`Fee updated: ${id}`, Logger.Level.INFO);
            return fee;
        } catch (error) {
            Logger.log(`Error updating fee: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const fee = await FeeRepository.delete(id);
            if (!fee) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Fee not found');
            }
            Logger.log(`Fee deleted: ${id}`, Logger.Level.INFO);
            return fee;
        } catch (error) {
            Logger.log(`Error deleting fee: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async payFee(feeId) {
        try {
            const fee = await FeeRepository.update(feeId, {
                status: FEE_STATUS.PAID,
                paidDate: new Date()
            });
            if (!fee) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Fee not found');
            }
            Logger.log(`Fee paid: ${feeId}`, Logger.Level.INFO);
            return fee;
        } catch (error) {
            Logger.log(`Error paying fee: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async generateMonthlyFees(organizationId, amount, dueDate) {
        try {
            const sessions = await StudentSessionRepository.findAll(organizationId, {}, 1, 10000);
            let feeCount = 0;

            for (const session of sessions.data) {
                // Check if fee already exists
                const existingFee = await FeeRepository.checkIfFeeExists(
                    session.studentId,
                    session._id,
                    FEE_TYPES.MONTHLY
                );

                if (!existingFee) {
                    await FeeRepository.create({
                        organizationId,
                        studentId: session.studentId,
                        studentSessionId: session._id,
                        classId: session.classId,
                        sectionId: session.sectionId || null,
                        type: FEE_TYPES.MONTHLY,
                        amount,
                        dueDate,
                        status: FEE_STATUS.PENDING
                    });
                    feeCount++;
                }
            }

            Logger.log(`Generated ${feeCount} monthly fees for organization: ${organizationId}`, Logger.Level.INFO);
            return { message: `${feeCount} fees generated successfully` };
        } catch (error) {
            Logger.log(`Error generating monthly fees: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getPendingFees(organizationId) {
        try {
            return await FeeRepository.findPendingFees(organizationId);
        } catch (error) {
            Logger.log(`Error fetching pending fees: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getOverdueFees(organizationId) {
        try {
            return await FeeRepository.findOverdueFees(organizationId);
        } catch (error) {
            Logger.log(`Error fetching overdue fees: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getFeesByType(studentId, type, organizationId, page = 1, limit = 10) {
        try {
            return await FeeRepository.findByStudentAndType(studentId, type, organizationId, page, limit);
        } catch (error) {
            Logger.log(`Error fetching fees by type: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new FeeService();
