import express from 'express';
import AdmissionTrackerController from '../controller/AdmissionTrackerController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

// Create admission entry
router.post('/',
    AdmissionTrackerController.create.bind(AdmissionTrackerController)
);

// Get all admission entries
router.get('/',
    authMiddleware,
    AdmissionTrackerController.getAll.bind(AdmissionTrackerController)
);

// Get admission entry by ID
router.get('/:id',
    authMiddleware,
    AdmissionTrackerController.getById.bind(AdmissionTrackerController)
);

// Update admission entry
router.put('/:id',
    authMiddleware,
    AdmissionTrackerController.update.bind(AdmissionTrackerController)
);

// Delete admission entry
router.delete('/:id',
    authMiddleware,
    AdmissionTrackerController.delete.bind(AdmissionTrackerController)
);

export default router;
