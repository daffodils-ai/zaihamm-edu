import Class from '../model/Class.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Class operations
 */
class ClassRepository {
    async create(data) {
        return new Class(data).save();
    }

    async findById(id) {
        return Class.findById(id);
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['name', 'description'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Class.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Class.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return Class.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return Class.findByIdAndDelete(id);
    }

    async findByOrganization(organizationId) {
        return Class.find({ organizationId }).sort({ createdAt: -1 });
    }
}

export default new ClassRepository();
