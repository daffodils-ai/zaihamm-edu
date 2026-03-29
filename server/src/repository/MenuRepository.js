import Menu from '../model/Menu.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Menu operations
 */
class MenuRepository {
    async create(data) {
        return new Menu(data).save();
    }

    async findById(id) {
        return Menu.findById(id);
    }

    async findByParentId(parentId, organizationId) {
        return Menu.find({ parentId, organizationId }).sort({ order: 1 });
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['name', 'url'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Menu.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ order: 1 }),
            Menu.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findMainMenus(organizationId) {
        return Menu.find({ organizationId, parentId: null }).sort({ order: 1 });
    }

    async update(id, data) {
        return Menu.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return Menu.findByIdAndDelete(id);
    }

    async findWithSubmenus(organizationId) {
        return Menu.find({ organizationId, parentId: null })
            .populate('parentId')
            .sort({ order: 1 });
    }
}

export default new MenuRepository();
