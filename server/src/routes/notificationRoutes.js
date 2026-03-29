import express from 'express';
import NotificationController from '../controller/NotificationController.js';
import { authMiddleware, studentAuthMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

// Create notification
router.post('/',
    authMiddleware,
    NotificationController.create.bind(NotificationController)
);

// Get all notifications
router.get('/',
    authMiddleware,
    NotificationController.getAll.bind(NotificationController)
);

// Get notifications by student
router.get('/student/:studentId',
    authMiddleware,
    NotificationController.getByStudent.bind(NotificationController)
);

// Get unread count
router.get('/student/:studentId/unread-count',
    studentAuthMiddleware,
    NotificationController.getUnreadCount.bind(NotificationController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    NotificationController.getById.bind(NotificationController)
);

// Mark as read
router.put('/:id/read',
    authMiddleware,
    NotificationController.markAsRead.bind(NotificationController)
);

// Update notification
router.put('/:id',
    authMiddleware,
    NotificationController.update.bind(NotificationController)
);

// Delete notification
router.delete('/:id',
    authMiddleware,
    NotificationController.delete.bind(NotificationController)
);

export default router;
