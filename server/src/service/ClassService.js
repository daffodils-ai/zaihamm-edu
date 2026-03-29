import ClassRepository from '../repository/ClassRepository.js';
import { ApiError } from '../utils/error.js';
import { ERROR_MESSAGES, HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Class operations
 */
class ClassService {
    async create(data) {
        try {
            const classData = await ClassRepository.create(data);
            Logger.log(`Class created: ${data.name}`, Logger.Level.INFO);
            return classData;
        } catch (error) {
            Logger.log(`Error creating class: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const classData = await ClassRepository.findById(id);
            if (!classData) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.CLASS_NOT_FOUND);
            }
            return classData;
        } catch (error) {
            Logger.log(`Error fetching class: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await ClassRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching classes: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const classData = await ClassRepository.update(id, data);
            if (!classData) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.CLASS_NOT_FOUND);
            }
            Logger.log(`Class updated: ${id}`, Logger.Level.INFO);
            return classData;
        } catch (error) {
            Logger.log(`Error updating class: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const classData = await ClassRepository.delete(id);
            if (!classData) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.CLASS_NOT_FOUND);
            }
            Logger.log(`Class deleted: ${id}`, Logger.Level.INFO);
            return classData;
        } catch (error) {
            Logger.log(`Error deleting class: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new ClassService();
