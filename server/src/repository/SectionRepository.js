import Section from '../model/Section.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Section operations
 */
class SectionRepository {
    async create(data) {
        return new Section(data).save();
    }

    async findById(id) {
        return Section.findById(id).populate('classId', 'name classCode');
    }

    async findByClass(classId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['name', 'description'];
        const query = { classId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Section.find(query)
                .populate('classId', 'name classCode')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Section.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['name', 'description'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Section.find(query)
                .populate('classId', 'name classCode')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Section.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return Section.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('classId', 'name classCode');
    }

    async findDuplicateByName({ organizationId, classId, name, excludeId = null }) {
        const normalizedName = `${name || ''}`.trim();
        const query = {
            organizationId,
            classId,
            name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
        };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        return Section.findOne(query);
    }

    async delete(id) {
        return Section.findByIdAndDelete(id);
    }
}

export default new SectionRepository();
