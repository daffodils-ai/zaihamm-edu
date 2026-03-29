import express from 'express';
import NoticeBoardController from '../controller/NoticeBoardController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

// Create notice
router.post('/',
    authMiddleware,
    NoticeBoardController.create.bind(NoticeBoardController)
);

// Get all notices
router.get('/',
    authMiddleware,
    NoticeBoardController.getAll.bind(NoticeBoardController)
);

// Get recent notices
router.get('/recent',
    authMiddleware,
    NoticeBoardController.getRecentNotices.bind(NoticeBoardController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    NoticeBoardController.getById.bind(NoticeBoardController)
);

// Update notice
router.put('/:id',
    authMiddleware,
    NoticeBoardController.update.bind(NoticeBoardController)
);

// Delete notice
router.delete('/:id',
    authMiddleware,
    NoticeBoardController.delete.bind(NoticeBoardController)
);

export default router;
