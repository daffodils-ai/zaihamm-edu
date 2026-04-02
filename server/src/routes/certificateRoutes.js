import express from 'express';
import CertificateController from '../controller/CertificateController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ALLOWED_ROLES_TO_ADMIT_STUDENT } from '../constants/index.js';

const router = express.Router();

router.get('/options', authMiddleware, CertificateController.getOptions.bind(CertificateController));
router.get('/', authMiddleware, CertificateController.getAll.bind(CertificateController));
router.post('/', authMiddleware, roleAccessMiddleware(ALLOWED_ROLES_TO_ADMIT_STUDENT), CertificateController.create.bind(CertificateController));
router.post('/bulk-download', authMiddleware, CertificateController.bulkDownload.bind(CertificateController));

export default router;
