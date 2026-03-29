import MenuRepository from '../repository/MenuRepository.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Menu operations
 */
class MenuService {
    async create(data) {
        try {
            const menu = await MenuRepository.create(data);
            Logger.log(`Menu created: ${data.name}`, Logger.Level.INFO);
            return menu;
        } catch (error) {
            Logger.log(`Error creating menu: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const menu = await MenuRepository.findById(id);
            if (!menu) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Menu not found');
            }
            return menu;
        } catch (error) {
            Logger.log(`Error fetching menu: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await MenuRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching menus: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getSubmenus(parentId, organizationId) {
        try {
            return await MenuRepository.findByParentId(parentId, organizationId);
        } catch (error) {
            Logger.log(`Error fetching submenus: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getMainMenus(organizationId) {
        try {
            return await MenuRepository.findMainMenus(organizationId);
        } catch (error) {
            Logger.log(`Error fetching main menus: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getMenusWithSubmenus(organizationId) {
        try {
            const mainMenus = await MenuRepository.findMainMenus(organizationId);
            const menus = [];

            for (const menu of mainMenus) {
                const submenus = await MenuRepository.findByParentId(menu._id, organizationId);
                menus.push({
                    ...menu.toObject(),
                    submenus
                });
            }

            return menus;
        } catch (error) {
            Logger.log(`Error fetching menus with submenus: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const menu = await MenuRepository.update(id, data);
            if (!menu) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Menu not found');
            }
            Logger.log(`Menu updated: ${id}`, Logger.Level.INFO);
            return menu;
        } catch (error) {
            Logger.log(`Error updating menu: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const menu = await MenuRepository.delete(id);
            if (!menu) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Menu not found');
            }
            Logger.log(`Menu deleted: ${id}`, Logger.Level.INFO);
            return menu;
        } catch (error) {
            Logger.log(`Error deleting menu: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new MenuService();
