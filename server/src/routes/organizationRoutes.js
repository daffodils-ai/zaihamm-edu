import express from 'express';
import OrganizationController from '../controller/OrganizationController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Signup new organization - No auth required
router.post('/signup', OrganizationController.signup.bind(OrganizationController));

// Get all organizations
router.get('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    OrganizationController.getAll.bind(OrganizationController)
);

// Get organization by ID
router.get('/:id',
    authMiddleware,
    OrganizationController.getById.bind(OrganizationController)
);

// Update organization
router.put('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    OrganizationController.update.bind(OrganizationController)
);

// Delete organization
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    OrganizationController.delete.bind(OrganizationController)
);

export default router;
