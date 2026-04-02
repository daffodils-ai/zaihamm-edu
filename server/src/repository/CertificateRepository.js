import Certificate from '../model/Certificate.js';
import { buildPaginationOptions } from '../utils/index.js';

class CertificateRepository {
    async createMany(data) {
        return Certificate.insertMany(data);
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const query = { organizationId };

        if (filters.classId) query.classId = filters.classId;
        if (filters.sectionId) query.sectionId = filters.sectionId;
        if (filters.studentId) query.studentId = filters.studentId;
        if (filters.certificateName) query.certificateName = filters.certificateName;

        const [data, total] = await Promise.all([
            Certificate.find(query)
                .populate('classId', 'name classCode')
                .populate('sectionId', 'name')
                .populate('studentId', 'fullName registrationNumber fatherName motherName fullAddress dateOfBirth')
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit),
            Certificate.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findByIds(organizationId, ids = []) {
        return Certificate.find({
            organizationId,
            _id: { $in: ids }
        })
            .populate('classId', 'name classCode')
            .populate('sectionId', 'name')
            .populate('studentId', 'fullName registrationNumber fatherName motherName fullAddress dateOfBirth')
            .sort({ createdAt: -1 });
    }
}

export default new CertificateRepository();
