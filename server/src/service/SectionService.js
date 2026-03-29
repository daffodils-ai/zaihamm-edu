import SectionRepository from '../repository/SectionRepository.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Section operations
 */
class SectionService {
    async create(data) {
        try {
            const section = await SectionRepository.create(data);
            Logger.log(`Section created: ${data.name}`, Logger.Level.INFO);
            return section;
        } catch (error) {
            Logger.log(`Error creating section: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const section = await SectionRepository.findById(id);
            if (!section) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.SECTION_NOT_FOUND);
            }
            return section;
        } catch (error) {
            Logger.log(`Error fetching section: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getByClass(classId, filters = {}, page = 1, limit = 10) {
        try {
            return await SectionRepository.findByClass(classId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching sections: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await SectionRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching sections: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const section = await SectionRepository.update(id, data);
            if (!section) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.SECTION_NOT_FOUND);
            }
            Logger.log(`Section updated: ${id}`, Logger.Level.INFO);
            return section;
        } catch (error) {
            Logger.log(`Error updating section: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const section = await SectionRepository.delete(id);
            if (!section) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.SECTION_NOT_FOUND);
            }
            Logger.log(`Section deleted: ${id}`, Logger.Level.INFO);
            return section;
        } catch (error) {
            Logger.log(`Error deleting section: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new SectionService();
