import express from 'express';
import ExamResultController from '../controller/ExamResultController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

router.post('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF, ROLES.ACCOUNTANT]),
    ExamResultController.create.bind(ExamResultController)
);

router.get('/',
    authMiddleware,
    ExamResultController.getAll.bind(ExamResultController)
);

router.get('/:id/pdf',
    authMiddleware,
    ExamResultController.downloadPdf.bind(ExamResultController)
);

router.put('/:id/finalize',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF, ROLES.ACCOUNTANT]),
    ExamResultController.finalize.bind(ExamResultController)
);

router.get('/:id',
    authMiddleware,
    ExamResultController.getById.bind(ExamResultController)
);

router.put('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF, ROLES.ACCOUNTANT]),
    ExamResultController.update.bind(ExamResultController)
);

router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF, ROLES.ACCOUNTANT]),
    ExamResultController.delete.bind(ExamResultController)
);

export default router;
