import Notification from '../model/Notification.js';
import { buildFilterQuery, buildPaginationOptions } from '../utils/index.js';

/**
 * Repository for Notification operations
 */
class NotificationRepository {
    async create(data) {
        return new Notification(data).save();
    }

    async findById(id) {
        return Notification.findById(id);
    }

    async findAll(organizationId, filters = {}, page = 1, limit = 10) {
        const allowedFields = ['type', 'title', 'isRead'];
        const query = { organizationId };
        Object.assign(query, buildFilterQuery(filters, allowedFields));

        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Notification.find(query)
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Notification.countDocuments(query)
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findByStudent(studentId, organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Notification.find({ studentId, organizationId })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Notification.countDocuments({ studentId, organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async findByUser(userId, organizationId, page = 1, limit = 10) {
        const pagination = buildPaginationOptions(page, limit);
        const [data, total] = await Promise.all([
            Notification.find({ userId, organizationId })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .sort({ createdAt: -1 }),
            Notification.countDocuments({ userId, organizationId })
        ]);

        return { data, total, page: pagination.page, limit: pagination.limit };
    }

    async update(id, data) {
        return Notification.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return Notification.findByIdAndDelete(id);
    }

    async markAsRead(id) {
        return Notification.findByIdAndUpdate(
            id,
            { isRead: true, updatedAt: new Date() },
            { new: true }
        );
    }

    async countUnread(studentId) {
        return Notification.countDocuments({ studentId, isRead: false });
    }
}

export default new NotificationRepository();
