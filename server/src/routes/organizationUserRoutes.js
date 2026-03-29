import express from 'express';
import OrganizationUserController from '../controller/OrganizationUserController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Login - No auth required
router.post('/login', OrganizationUserController.login.bind(OrganizationUserController));

// Create user - Only organization admin can create
router.post('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    OrganizationUserController.create.bind(OrganizationUserController)
);

// Get all users
router.get('/',
    authMiddleware,
    OrganizationUserController.getAll.bind(OrganizationUserController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    OrganizationUserController.getById.bind(OrganizationUserController)
);

// Update user
router.put('/:id',
    authMiddleware,
    OrganizationUserController.update.bind(OrganizationUserController)
);

// Delete user
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    OrganizationUserController.delete.bind(OrganizationUserController)
);

// Reset password
router.post('/reset-password',
    authMiddleware,
    OrganizationUserController.resetPassword.bind(OrganizationUserController)
);

export default router;
