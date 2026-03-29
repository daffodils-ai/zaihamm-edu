import OrganizationMenu from '../model/OrganizationMenu.js';
import { buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Organization Menu operations
 */
class OrganizationMenuRepository {
    async create(data) {
        return new OrganizationMenu(data).save();
    }

    async findById(id) {
        return OrganizationMenu.findById(id);
    }

    async findByOrganizationAndRole(organizationId, role, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            OrganizationMenu.find({ organizationId, role })
                .populate('menuId')
                .skip(pagination.skip)
                .limit(pagination.limit),
            OrganizationMenu.countDocuments({ organizationId, role })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findAll(organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            OrganizationMenu.find({ organizationId })
                .populate('menuId')
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            OrganizationMenu.countDocuments({ organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return OrganizationMenu.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('menuId');
    }

    async delete(id) {
        return OrganizationMenu.findByIdAndDelete(id);
    }

    async deleteByMenuId(menuId) {
        return OrganizationMenu.deleteMany({ menuId });
    }
}

export default new OrganizationMenuRepository();
