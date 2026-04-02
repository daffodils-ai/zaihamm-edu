import Subject from '../model/Subject.js';
import { buildPaginationOptions } from '../utils/index.js';

class SubjectRepository {
    async create(data) {
        return new Subject(data).save();
    }

    async findById(id) {
        return Subject.findById(id).populate('classIds', 'name classCode');
    }

    async findByName(organizationId, nameNormalized, excludeId = null) {
        const query = { organizationId, nameNormalized };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        return Subject.findOne(query);
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const query = { organizationId };

        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' };
        }

        if (filters.classId) {
            query.$or = [
                { classIds: filters.classId },
                { classIds: { $size: 0 } }
            ];
        }

        const [data, total] = await Promise.all([
            Subject.find(query)
                .populate('classIds', 'name classCode')
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit),
            Subject.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findAvailableByClass(organizationId, classId = null) {
        const query = { organizationId, isActive: true };

        if (classId) {
            query.$or = [
                { classIds: classId },
                { classIds: { $size: 0 } }
            ];
        }

        return Subject.find(query)
            .populate('classIds', 'name classCode')
            .sort({ name: 1 });
    }

    async update(id, data) {
        return Subject.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).populate('classIds', 'name classCode');
    }

    async delete(id) {
        return Subject.findByIdAndDelete(id);
    }
}

export default new SubjectRepository();
