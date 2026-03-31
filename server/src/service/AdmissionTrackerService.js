import AdmissionTrackerRepository from '../repository/AdmissionTrackerRepository.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for AdmissionTracker operations
 */
class AdmissionTrackerService {
    async create(data) {
        try {
            const admission = await AdmissionTrackerRepository.create(data);
            Logger.log(`Admission entry created for: ${data.fullName}`, Logger.Level.INFO);
            return admission;
        } catch (error) {
            Logger.log(`Error creating admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const admission = await AdmissionTrackerRepository.findById(id);
            if (!admission) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Admission entry not found');
            }
            return admission;
        } catch (error) {
            Logger.log(`Error fetching admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(filters = {}, page = 1, limit = 10) {
        try {
            return await AdmissionTrackerRepository.findAll(filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching admission entries: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const admission = await AdmissionTrackerRepository.update(id, data);
            if (!admission) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Admission entry not found');
            }
            Logger.log(`Admission entry updated: ${id}`, Logger.Level.INFO);
            return admission;
        } catch (error) {
            Logger.log(`Error updating admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const admission = await AdmissionTrackerRepository.delete(id);
            if (!admission) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Admission entry not found');
            }
            Logger.log(`Admission entry deleted: ${id}`, Logger.Level.INFO);
            return admission;
        } catch (error) {
            Logger.log(`Error deleting admission entry: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new AdmissionTrackerService();
