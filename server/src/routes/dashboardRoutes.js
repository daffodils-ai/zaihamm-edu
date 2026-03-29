import express from 'express';
import DashboardController from '../controller/DashboardController.js';
import {authMiddleware} from '../middleware/auth_middleware.js';

const router = express.Router();

/**
 * All dashboard routes require authentication
 */
router.use(authMiddleware);

/**
 * GET /api/v1/dashboard/analytics
 * Get complete dashboard analytics with all summaries
 * Query params: startDate, endDate, classId, sectionId
 */
router.get('/analytics', DashboardController.getAnalytics);

/**
 * GET /api/v1/dashboard/admission
 * Get admission analytics only
 * Query params: startDate, endDate
 */
router.get('/admission', DashboardController.getAdmissionAnalytics);

/**
 * GET /api/v1/dashboard/revenue
 * Get revenue analytics only
 * Query params: startDate, endDate
 */
router.get('/revenue', DashboardController.getRevenueAnalytics);

/**
 * GET /api/v1/dashboard/students
 * Get student analytics
 * Query params: classId, sectionId
 */
router.get('/students', DashboardController.getStudentAnalytics);

/**
 * GET /api/v1/dashboard/classes
 * Get class analytics with student distribution
 */
router.get('/classes', DashboardController.getClassAnalytics);

/**
 * GET /api/v1/dashboard/sections
 * Get section analytics with student distribution
 */
router.get('/sections', DashboardController.getSectionAnalytics);

/**
 * GET /api/v1/dashboard/notices
 * Get notice board analytics
 */
router.get('/notices', DashboardController.getNoticeAnalytics);

export default router;
