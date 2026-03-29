import express from 'express';
import SectionController from '../controller/SectionController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Create section
router.post('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    SectionController.create.bind(SectionController)
);

// Get all sections
router.get('/',
    authMiddleware,
    SectionController.getAll.bind(SectionController)
);

// Get sections by class
router.get('/class/:classId',
    authMiddleware,
    SectionController.getByClass.bind(SectionController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    SectionController.getById.bind(SectionController)
);

// Update section
router.put('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    SectionController.update.bind(SectionController)
);

// Delete section
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    SectionController.delete.bind(SectionController)
);

export default router;
