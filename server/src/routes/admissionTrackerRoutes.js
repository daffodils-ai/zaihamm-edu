import express from 'express';
import multer from 'multer';
import AdmissionTrackerController from '../controller/AdmissionTrackerController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create admission entry
router.post('/',
    AdmissionTrackerController.create.bind(AdmissionTrackerController)
);

router.get('/template/download',
    authMiddleware,
    AdmissionTrackerController.downloadTemplate.bind(AdmissionTrackerController)
);

router.get('/export',
    authMiddleware,
    AdmissionTrackerController.exportCsv.bind(AdmissionTrackerController)
);

router.post('/bulk-import',
    authMiddleware,
    AdmissionTrackerController.bulkImport.bind(AdmissionTrackerController)
);

router.post('/bulk-import-file',
    authMiddleware,
    upload.single('file'),
    AdmissionTrackerController.bulkImportFile.bind(AdmissionTrackerController)
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
