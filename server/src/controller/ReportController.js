import ReportService from '../service/ReportService.js';
import { Logger } from '../logger/logger.js';
import { SUCCESS_MESSAGES, HTTP_CODES } from '../constants/index.js';

class ReportController {
    /**
     * Download admission report as CSV
     * GET /reports/admission/download
     */
    async downloadAdmissionReport(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            } = req.query;

            const filters = {
                organizationId,
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            };

            Logger.info('Generating admission report with filters:', filters);

            const reportData = await ReportService.getAdmissionReportData(filters);

            const csv = ReportService.dataToCSV(reportData);
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `admission-report-${timestamp}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

            // Stream the data
            res.write('\uFEFF'); // Add BOM for Excel UTF-8 compatibility
            res.end(csv);

            Logger.info('Admission report downloaded successfully');
        } catch (error) {
            Logger.error('Error in ReportController.downloadAdmissionReport:', error);
            next(error);
        }
    }

    /**
     * Get admission report as JSON
     * GET /reports/admission
     */
    async getAdmissionReport(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            } = req.query;

            const filters = {
                organizationId,
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            };

            Logger.info('Generating admission report with filters:', filters);

            const reportData = await ReportService.getAdmissionReportData(filters);

            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: reportData,
                count: reportData.length,
                generatedAt: new Date()
            });

            Logger.info('Admission report generated successfully');
        } catch (error) {
            Logger.error('Error in ReportController.getAdmissionReport:', error);
            next(error);
        }
    }

    /**
     * Download fee report as CSV
     * GET /reports/fees/download
     */
    async downloadFeeReport(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            } = req.query;

            const filters = {
                organizationId,
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            };

            Logger.info('Generating fee report with filters:', filters);

            const reportData = await ReportService.getFeeReportData(filters);

            const csv = ReportService.dataToCSV(reportData);
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `fee-report-${timestamp}.csv`;

            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

            // Stream the data
            res.write('\uFEFF'); // Add BOM for Excel UTF-8 compatibility
            res.end(csv);

            Logger.info('Fee report downloaded successfully');
        } catch (error) {
            Logger.error('Error in ReportController.downloadFeeReport:', error);
            next(error);
        }
    }

    /**
     * Get fee report as JSON
     * GET /reports/fees
     */
    async getFeeReport(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            } = req.query;

            const filters = {
                organizationId,
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId,
                status
            };

            Logger.info('Generating fee report with filters:', filters);

            const reportData = await ReportService.getFeeReportData(filters);

            // Calculate totals
            const totalAmount = reportData.reduce((sum, item) => sum + (item['Amount'] || 0), 0);
            const paidRecords = reportData.filter(item => item['Status'] === 'paid').length;
            const pendingRecords = reportData.filter(item => item['Status'] === 'pending').length;

            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: reportData,
                summary: {
                    totalRecords: reportData.length,
                    totalAmount,
                    paidRecords,
                    pendingRecords
                },
                generatedAt: new Date()
            });

            Logger.info('Fee report generated successfully');
        } catch (error) {
            Logger.error('Error in ReportController.getFeeReport:', error);
            next(error);
        }
    }

    /**
     * Get combined report (admission + fees summary)
     * GET /reports/combined
     */
    async getCombinedReport(req, res, next) {
        try {
            const organizationId = req.user.organizationId;
            const {
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId
            } = req.query;

            const filters = {
                organizationId,
                startDate,
                endDate,
                registrationNumber,
                classId,
                sectionId
            };

            Logger.info('Generating combined report with filters:', filters);

            const admissionData = await ReportService.getAdmissionReportData(filters);
            const feeData = await ReportService.getFeeReportData(filters);

            const totalFees = feeData.reduce((sum, item) => sum + (item['Amount'] || 0), 0);
            const paidFees = feeData
                .filter(item => item['Status'] === 'paid')
                .reduce((sum, item) => sum + (item['Amount'] || 0), 0);

            res.status(HTTP_CODES.SUCCESS).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
                data: {
                    admissionReport: {
                        count: admissionData.length,
                        data: admissionData
                    },
                    feeReport: {
                        count: feeData.length,
                        data: feeData,
                        summary: {
                            totalAmount: totalFees,
                            paidAmount: paidFees,
                            pendingAmount: totalFees - paidFees
                        }
                    }
                },
                generatedAt: new Date()
            });

            Logger.info('Combined report generated successfully');
        } catch (error) {
            Logger.error('Error in ReportController.getCombinedReport:', error);
            next(error);
        }
    }
}

export default new ReportController();
