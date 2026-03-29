import NotificationRepository from '../repository/NotificationRepository.js';
import { ApiError } from '../utils/error.js';
import { HTTP_CODES } from '../constants/index.js';
import { Logger } from '../logger/logger.js';

/**
 * Service for Notification operations
 */
class NotificationService {
    async create(data) {
        try {
            const notification = await NotificationRepository.create(data);
            Logger.log(`Notification created: ${data.title}`, Logger.Level.INFO);
            return notification;
        } catch (error) {
            Logger.log(`Error creating notification: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getById(id) {
        try {
            const notification = await NotificationRepository.findById(id);
            if (!notification) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Notification not found');
            }
            return notification;
        } catch (error) {
            Logger.log(`Error fetching notification: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getAll(organizationId, filters = {}, page = 1, limit = 10) {
        try {
            return await NotificationRepository.findAll(organizationId, filters, page, limit);
        } catch (error) {
            Logger.log(`Error fetching notifications: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getByStudent(studentId, organizationId, page = 1, limit = 10) {
        try {
            return await NotificationRepository.findByStudent(studentId, organizationId, page, limit);
        } catch (error) {
            Logger.log(`Error fetching student notifications: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getByUser(userId, organizationId, page = 1, limit = 10) {
        try {
            return await NotificationRepository.findByUser(userId, organizationId, page, limit);
        } catch (error) {
            Logger.log(`Error fetching user notifications: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const notification = await NotificationRepository.update(id, data);
            if (!notification) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Notification not found');
            }
            Logger.log(`Notification updated: ${id}`, Logger.Level.INFO);
            return notification;
        } catch (error) {
            Logger.log(`Error updating notification: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async delete(id) {
        try {
            const notification = await NotificationRepository.delete(id);
            if (!notification) {
                throw new ApiError(HTTP_CODES.NOT_FOUND, 'Notification not found');
            }
            Logger.log(`Notification deleted: ${id}`, Logger.Level.INFO);
            return notification;
        } catch (error) {
            Logger.log(`Error deleting notification: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async markAsRead(id) {
        try {
            return await NotificationRepository.markAsRead(id);
        } catch (error) {
            Logger.log(`Error marking notification as read: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }

    async getUnreadCount(studentId) {
        try {
            return await NotificationRepository.countUnread(studentId);
        } catch (error) {
            Logger.log(`Error counting unread notifications: ${error.message}`, Logger.Level.ERROR);
            throw error;
        }
    }
}

export default new NotificationService();
