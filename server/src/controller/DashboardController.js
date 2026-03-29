import DashboardService from '../service/DashboardService.js';
import { Logger } from '../logger/logger.js';
import { ApiError } from '../utils/error.js';
import { SUCCESS_MESSAGES, HTTP_CODES } from '../constants/index.js';

class DashboardController {
    /**
     * Get dashboard analytics
     * GET /dashboard/analytics
     */
    async getAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const { startDate, endDate, classId, sectionId } = req.query;

            const filters = {};
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;
            if (classId) filters.classId = classId;
            if (sectionId) filters.sectionId = sectionId;

            const analytics = await DashboardService.getDashboardSummary(
                organizationId,
                filters
            );

            Logger.info('Dashboard analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getAnalytics:', error);
            next(error);
        }
    }

    /**
     * Get admission analytics only
     * GET /dashboard/admission
     */
    async getAdmissionAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const { startDate, endDate } = req.query;

            const filters = {};
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const analytics = await DashboardService.getAdmissionAnalytics(
                organizationId,
                filters
            );

            Logger.info('Admission analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getAdmissionAnalytics:', error);
            next(error);
        }
    }

    /**
     * Get revenue analytics only
     * GET /dashboard/revenue
     */
    async getRevenueAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const { startDate, endDate } = req.query;

            const filters = {};
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const analytics = await DashboardService.getRevenueAnalytics(
                organizationId,
                filters
            );

            Logger.info('Revenue analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getRevenueAnalytics:', error);
            next(error);
        }
    }

    /**
     * Get student analytics only
     * GET /dashboard/students
     */
    async getStudentAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const { classId, sectionId } = req.query;

            const filters = {};
            if (classId) filters.classId = classId;
            if (sectionId) filters.sectionId = sectionId;

            const analytics = await DashboardService.getStudentAnalytics(
                organizationId,
                filters
            );

            Logger.info('Student analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getStudentAnalytics:', error);
            next(error);
        }
    }

    /**
     * Get class analytics only
     * GET /dashboard/classes
     */
    async getClassAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;

            const analytics = await DashboardService.getClassAnalytics(organizationId);

            Logger.info('Class analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getClassAnalytics:', error);
            next(error);
        }
    }

    /**
     * Get section analytics only
     * GET /dashboard/sections
     */
    async getSectionAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;

            const analytics = await DashboardService.getSectionAnalytics(organizationId);

            Logger.info('Section analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getSectionAnalytics:', error);
            next(error);
        }
    }

    /**
     * Get notice analytics only
     * GET /dashboard/notices
     */
    async getNoticeAnalytics(req, res, next) {
        try {
            const organizationId = req.user.organizationId;

            const analytics = await DashboardService.getNoticeAnalytics(organizationId);

            Logger.info('Notice analytics fetched successfully');
            
            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: analytics
            });
        } catch (error) {
            Logger.error('Error in DashboardController.getNoticeAnalytics:', error);
            next(error);
        }
    }
}

export default new DashboardController();
