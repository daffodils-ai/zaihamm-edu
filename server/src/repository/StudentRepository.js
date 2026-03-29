import Student from '../model/Student.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Student operations
 */
class StudentRepository {
    async create(data) {
        return new Student(data).save();
    }

    async findById(id) {
        return Student.findById(id);
    }

    async findByRegistrationNumber(registrationNumber) {
        return Student.findOne({ registrationNumber });
    }

    async findByAadhar(aadhar, organizationId = null) {
        const query = { aadharNo: aadhar };
        if (organizationId) {
            query.organizationId = organizationId;
        }
        return Student.findOne(query);
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['fullName', 'email', 'mobile', 'status', 'aadharNo'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Student.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Student.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return Student.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return Student.findByIdAndDelete(id);
    }

    async findByOrganization(organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Student.find({ organizationId })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Student.countDocuments({ organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async updateStatus(id, status) {
        return Student.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date() },
            { new: true }
        );
    }
}

export default new StudentRepository();
