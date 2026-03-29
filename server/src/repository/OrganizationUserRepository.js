import OrganizationUser from '../model/OrganizationUser.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Organization User operations
 */
class OrganizationUserRepository {
    async create(data) {
        return new OrganizationUser(data).save();
    }

    async findById(id) {
        return OrganizationUser.findById(id).select('-password');
    }

    async findByEmail(email, organizationId = null) {
        const query = { email: email.toLowerCase() };
        if (organizationId) {
            query.organizationId = organizationId;
        }
        return OrganizationUser.findOne(query);
    }

    async findByMobile(mobile, organizationId = null) {
        const query = { mobile };
        if (organizationId) {
            query.organizationId = organizationId;
        }
        return OrganizationUser.findOne(query);
    }

    async findByEmailWithPassword(email) {
        return OrganizationUser.findOne({ email: email.toLowerCase() });
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['email', 'mobile', 'role', 'status', 'firstName', 'lastName'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            OrganizationUser.find(query)
                .select('-password')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            OrganizationUser.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return OrganizationUser.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password');
    }

    async delete(id) {
        return OrganizationUser.findByIdAndDelete(id);
    }

    async updatePassword(id, hashedPassword) {
        return OrganizationUser.findByIdAndUpdate(
            id,
            { password: hashedPassword, updatedAt: new Date() },
            { new: true }
        );
    }

    async findByOrganizationAndRole(organizationId, role) {
        return OrganizationUser.find({ organizationId, role }).select('-password');
    }
}

export default new OrganizationUserRepository();
