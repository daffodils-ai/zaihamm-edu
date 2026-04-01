import ExamResult from '../model/ExamResult.js';
import { buildPaginationOptions } from '../utils/index.js';

class ExamResultRepository {
    async create(data) {
        return new ExamResult(data).save();
    }

    async findById(id) {
        return ExamResult.findById(id)
            .populate('studentId', 'fullName registrationNumber')
            .populate('classId', 'name classCode')
            .populate('sectionId', 'name');
    }

    async findDuplicateExam({
        organizationId,
        studentId,
        classId,
        sectionKey,
        year,
        examNameNormalized,
        excludeId = null
    }) {
        const query = {
            organizationId,
            studentId,
            classId,
            sectionKey,
            year,
            examNameNormalized
        };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        return ExamResult.findOne(query);
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const query = { organizationId };

        if (filters.studentId) query.studentId = filters.studentId;
        if (filters.classId) query.classId = filters.classId;
        if (filters.sectionId) query.sectionId = filters.sectionId;

        if (filters.examDate) {
            const start = new Date(filters.examDate);
            start.setUTCHours(0, 0, 0, 0);
            const end = new Date(filters.examDate);
            end.setUTCHours(23, 59, 59, 999);
            query.examDate = { $gte: start, $lte: end };
        }

        const [data, total] = await Promise.all([
            ExamResult.find(query)
                .populate('studentId', 'fullName registrationNumber')
                .populate('classId', 'name classCode')
                .populate('sectionId', 'name')
                .sort({ examDate: -1, createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit),
            ExamResult.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return ExamResult.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        )
            .populate('studentId', 'fullName registrationNumber')
            .populate('classId', 'name classCode')
            .populate('sectionId', 'name');
    }

    async delete(id) {
        return ExamResult.findByIdAndDelete(id);
    }
}

export default new ExamResultRepository();
