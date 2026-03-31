import Fee from '../model/Fee.js';
import { FEE_STATUS, FEE_TYPES } from '../constants/index.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Fee operations
 */
class FeeRepository {
    async create(data) {
        return new Fee(data).save();
    }

    async findById(id) {
        return Fee.findById(id)
            .populate('studentId', 'fullName registrationNumber')
            .populate('classId', 'name classCode');
    }

    async findByStudent(studentId, organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Fee.find({ studentId, organizationId })
                .populate('studentId', 'fullName registrationNumber')
                .populate('classId', 'name classCode')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ dueDate: -1 }),
            Fee.countDocuments({ studentId, organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['type', 'status', 'studentId', 'classId'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Fee.find(query)
                .populate('studentId', 'fullName registrationNumber')
                .populate('classId', 'name classCode')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ dueDate: -1 }),
            Fee.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return Fee.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        )
            .populate('studentId', 'fullName registrationNumber')
            .populate('classId', 'name classCode');
    }

    async delete(id) {
        return Fee.findByIdAndDelete(id);
    }

    async findPendingFees(organizationId) {
        return Fee.find({
            organizationId,
            status: FEE_STATUS.PENDING
        }).sort({ dueDate: 1 });
    }

    async findOverdueFees(organizationId) {
        return Fee.find({
            organizationId,
            status: { $in: [FEE_STATUS.PENDING, FEE_STATUS.OVERDUE] },
            dueDate: { $lt: new Date() }
        }).sort({ dueDate: 1 });
    }

    async findByStudentAndType(studentId, type, organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Fee.find({ studentId, type, organizationId })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ dueDate: -1 }),
            Fee.countDocuments({ studentId, type, organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findFeesForMonthly(organizationId) {
        return Fee.find({
            organizationId,
            type: FEE_TYPES.MONTHLY,
            status: FEE_STATUS.PENDING
        });
    }

    async checkIfFeeExists(studentId, studentSessionId, type) {
        return Fee.findOne({
            studentId,
            studentSessionId,
            type
        });
    }
}

export default new FeeRepository();
