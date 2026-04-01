import express from 'express';
import StudentController from '../controller/StudentController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Student login - No auth required
router.post('/login', StudentController.studentLogin.bind(StudentController));

// Admit student - Requires role permission
router.post('/admit',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF, ROLES.ACCOUNTANT]),
    StudentController.admit.bind(StudentController)
);

// Get all students
router.get('/',
    authMiddleware,
    StudentController.getAll.bind(StudentController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    StudentController.getById.bind(StudentController)
);

// Update student
router.put('/:id',
    authMiddleware,
    StudentController.update.bind(StudentController)
);

// Delete student
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF]),
    StudentController.delete.bind(StudentController)
);

// Promote student to next year
router.post('/promote/:studentId',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION, ROLES.ADMISSION_STAFF]),
    StudentController.promoteStudent.bind(StudentController)
);

// Get student session history
router.get('/:studentId/history',
    authMiddleware,
    StudentController.getStudentHistory.bind(StudentController)
);

// Get latest session
router.get('/:studentId/latest-session',
    authMiddleware,
    StudentController.getLatestSession.bind(StudentController)
);

export default router;
