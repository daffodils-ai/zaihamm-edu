import Organization from '../model/Organization.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Organization operations
 */
class OrganizationRepository {
    async create(data) {
        return new Organization(data).save();
    }

    async findById(id) {
        return Organization.findById(id);
    }

    async findByEmail(email) {
        return Organization.findOne({ email: email.toLowerCase() });
    }

    async findAll(filters = {}, page = 1, limit = 10) {
        const allowedFields = ['name', 'email', 'mobile', 'status'];
        const query = {};
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Organization.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Organization.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return Organization.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return Organization.findByIdAndDelete(id);
    }
}

export default new OrganizationRepository();
