import express from 'express';
import FeeController from '../controller/FeeController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Create fee
router.post('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF, ROLES.ACCOUNTANT]),
    FeeController.create.bind(FeeController)
);

// Get all fees
router.get('/',
    authMiddleware,
    FeeController.getAll.bind(FeeController)
);

// Get fees by student
router.get('/student/:studentId',
    authMiddleware,
    FeeController.getByStudent.bind(FeeController)
);

// Get pending fees
router.get('/report/pending',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ACCOUNTANT]),
    FeeController.getPendingFees.bind(FeeController)
);

// Get overdue fees
router.get('/report/overdue',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ACCOUNTANT]),
    FeeController.getOverdueFees.bind(FeeController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    FeeController.getById.bind(FeeController)
);

// Update fee
router.put('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ACCOUNTANT]),
    FeeController.update.bind(FeeController)
);

// Pay fee
router.put('/:id/pay',
    authMiddleware,
    FeeController.payFee.bind(FeeController)
);

// Delete fee
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ACCOUNTANT]),
    FeeController.delete.bind(FeeController)
);

// Generate monthly fees
router.post('/generate/monthly',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ACCOUNTANT]),
    FeeController.generateMonthlyFees.bind(FeeController)
);

export default router;
