import StudentSession from '../model/StudentSession.js';
import { buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Student Session operations
 */
class StudentSessionRepository {
    async create(data, options = {}) {
        return new StudentSession(data).save(options);
    }

    async findById(id) {
        return StudentSession.findById(id);
    }

    async findByStudentAndYear(studentId, year, organizationId) {
        return StudentSession.findOne({ studentId, year, organizationId });
    }

    async findLatestByStudent(studentId) {
        return StudentSession.findOne({ studentId })
            .populate('classId', 'name classCode')
            .populate('sectionId', 'name')
            .sort({ year: -1 })
            .limit(1);
    }

    async findHistoryByStudent(studentId, organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            StudentSession.find({ studentId, organizationId })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ year: -1 }),
            StudentSession.countDocuments({ studentId, organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findAll(organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            StudentSession.find({ organizationId })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            StudentSession.countDocuments({ organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return StudentSession.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return StudentSession.findByIdAndDelete(id);
    }

    async findByClass(classId, year, organizationId) {
        return StudentSession.find({ classId, year, organizationId });
    }

    async findByClassAndSection(classId, sectionId = null, organizationId = null) {
        const query = { classId };
        if (sectionId) {
            query.sectionId = sectionId;
        }
        if (organizationId) {
            query.organizationId = organizationId;
        }

        return StudentSession.find(query)
            .populate('studentId', 'fullName registrationNumber organizationId fatherName motherName fullAddress dateOfBirth studentPic')
            .populate('classId', 'name classCode')
            .populate('sectionId', 'name')
            .sort({ year: -1, createdAt: -1 });
    }
}

export default new StudentSessionRepository();
