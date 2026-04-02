import express from 'express';
import SubjectController from '../controller/SubjectController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ALLOWED_ROLES_TO_ADMIT_STUDENT } from '../constants/index.js';

const router = express.Router();

router.get('/available', authMiddleware, SubjectController.getAvailable.bind(SubjectController));
router.get('/', authMiddleware, SubjectController.getAll.bind(SubjectController));
router.get('/:id', authMiddleware, SubjectController.getById.bind(SubjectController));
router.post('/', authMiddleware, roleAccessMiddleware(ALLOWED_ROLES_TO_ADMIT_STUDENT), SubjectController.create.bind(SubjectController));
router.put('/:id', authMiddleware, roleAccessMiddleware(ALLOWED_ROLES_TO_ADMIT_STUDENT), SubjectController.update.bind(SubjectController));
router.delete('/:id', authMiddleware, roleAccessMiddleware(ALLOWED_ROLES_TO_ADMIT_STUDENT), SubjectController.delete.bind(SubjectController));

export default router;
