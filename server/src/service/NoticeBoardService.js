import NoticeBoardRepository from '../repository/NoticeBoardRepository.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for NoticeBoard operations
 */
class NoticeBoardService {
    async create(data) {
        try {
            const notice = await NoticeBoardRepository.create(data);
            Logger.log(`Notice created: ${data.title}`, Logger.Level.INFO);
            return notice;
        } catch (error) {
            Logger.log(`Error creating notice: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const notice = await NoticeBoardRepository.findById(id);
            if (!notice) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Notice not found');
            }
            return notice;
        } catch (error) {
            Logger.log(`Error fetching notice: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await NoticeBoardRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching notices: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const notice = await NoticeBoardRepository.update(id, data);
            if (!notice) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Notice not found');
            }
            Logger.log(`Notice updated: ${id}`, Logger.Level.INFO);
            return notice;
        } catch (error) {
            Logger.log(`Error updating notice: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const notice = await NoticeBoardRepository.delete(id);
            if (!notice) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Notice not found');
            }
            Logger.log(`Notice deleted: ${id}`, Logger.Level.INFO);
            return notice;
        } catch (error) {
            Logger.log(`Error deleting notice: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getRecentNotices(organizationId) {
        try {
            return await NoticeBoardRepository.findRecentNotices(organizationId);
        } catch (error) {
            Logger.log(`Error fetching recent notices: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new NoticeBoardService();
