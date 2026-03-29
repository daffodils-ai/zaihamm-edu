import express from 'express';
import ReportController from '../controller/ReportController.js';
import {authMiddleware} from '../middleware/auth_middleware.js';

const router = express.Router();

/**
 * All report routes require authentication
 */
router.use(authMiddleware);

/**
 * GET /api/v1/reports/admission
 * Get admission report as JSON
 * Query params: startDate, endDate, registrationNumber, classId, sectionId, status
 */
router.get('/admission', ReportController.getAdmissionReport);

/**
 * GET /api/v1/reports/admission/download
 * Download admission report as CSV file
 * Query params: startDate, endDate, registrationNumber, classId, sectionId, status
 */
router.get('/admission/download', ReportController.downloadAdmissionReport);

/**
 * GET /api/v1/reports/fees
 * Get fee report as JSON
 * Query params: startDate, endDate, registrationNumber, classId, sectionId, status
 */
router.get('/fees', ReportController.getFeeReport);

/**
 * GET /api/v1/reports/fees/download
 * Download fee report as CSV file
 * Query params: startDate, endDate, registrationNumber, classId, sectionId, status
 */
router.get('/fees/download', ReportController.downloadFeeReport);

/**
 * GET /api/v1/reports/combined
 * Get combined report (admission + fees)
 * Query params: startDate, endDate, registrationNumber, classId, sectionId
 */
router.get('/combined', ReportController.getCombinedReport);

export default router;
