import CertificateService from '../service/CertificateService.js';
import { HTTP_CODES, SUCCESS_MESSAGES } from '../constants/index.js';

class CertificateController {
    async create(req, res, next) {
        try {
            const data = await CertificateService.generateRecords(req.user.organizationId, req.body);
            res.status(HTTP_CODES.CREATED).json({
                success: true,
                statusCode: HTTP_CODES.CREATED,
                message: SUCCESS_MESSAGES.CREATED,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await CertificateService.getAll(req.user.organizationId, filters, page, limit);
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: result.data,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    pages: Math.ceil(result.total / result.limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getOptions(req, res, next) {
        try {
            res.status(HTTP_CODES.OK).json({
                success: true,
                statusCode: HTTP_CODES.OK,
                message: SUCCESS_MESSAGES.FETCHED,
                data: CertificateService.getCertificateNames()
            });
        } catch (error) {
            next(error);
        }
    }

    async bulkDownload(req, res, next) {
        try {
            const zipBuffer = await CertificateService.downloadZip(req.user.organizationId, req.body?.ids || []);
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="certificates.zip"');
            res.status(HTTP_CODES.OK).send(zipBuffer);
        } catch (error) {
            next(error);
        }
    }
}

export default new CertificateController();
