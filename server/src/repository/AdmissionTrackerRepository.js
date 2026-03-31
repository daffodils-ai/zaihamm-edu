import AdmissionTracker from '../model/admissionTracker.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for AdmissionTracker operations
 */
class AdmissionTrackerRepository {
    async create(data) {
        return new AdmissionTracker(data).save();
    }

    async findById(id) {
        return AdmissionTracker.findById(id);
    }

    async findAll(filters = {}, page = 1, limit = 10) {
        const allowedFields = ['fullName', 'fatherName', 'motherName', 'aadharNo', 'parentMobile'];
        const { fromDate, toDate, ...otherFilters } = filters;
        const query = {};
        
        Object.assign(query, buildFilterQuery(otherFilters, allowedFields));

        if (fromDate) {
            const parsedFromDate = new Date(fromDate);
            if (!Number.isNaN(parsedFromDate.getTime())) {
                query.createdAt = { ...(query.createdAt || {}), $gte: parsedFromDate };
            }
        }

        if (toDate) {
            const parsedToDate = new Date(toDate);
            if (!Number.isNaN(parsedToDate.getTime())) {
                query.createdAt = { ...(query.createdAt || {}), $lte: parsedToDate };
            }
        }

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            AdmissionTracker.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            AdmissionTracker.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return AdmissionTracker.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return AdmissionTracker.findByIdAndDelete(id);
    }
}

export default new AdmissionTrackerRepository();
