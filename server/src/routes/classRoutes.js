import express from 'express';
import ClassController from '../controller/ClassController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Create class
router.post('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    ClassController.create.bind(ClassController)
);

// Get all classes
router.get('/',
    authMiddleware,
    ClassController.getAll.bind(ClassController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    ClassController.getById.bind(ClassController)
);

// Update class
router.put('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    ClassController.update.bind(ClassController)
);

// Delete class
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    ClassController.delete.bind(ClassController)
);

export default router;
