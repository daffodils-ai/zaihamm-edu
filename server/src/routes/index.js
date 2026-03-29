import express from 'express';
import organizationRoutes from './organizationRoutes.js';
import organizationUserRoutes from './organizationUserRoutes.js';
import studentRoutes from './studentRoutes.js';
import classRoutes from './classRoutes.js';
import sectionRoutes from './sectionRoutes.js';
import menuRoutes from './menuRoutes.js';
import noticeBoardRoutes from './noticeBoardRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import feeRoutes from './feeRoutes.js';

const router = express.Router();

// API Routes
router.use('/api/v1/organizations', organizationRoutes);
router.use('/api/v1/organization-users', organizationUserRoutes);
router.use('/api/v1/students', studentRoutes);
router.use('/api/v1/classes', classRoutes);
router.use('/api/v1/sections', sectionRoutes);
router.use('/api/v1/menus', menuRoutes);
router.use('/api/v1/notices', noticeBoardRoutes);
router.use('/api/v1/notifications', notificationRoutes);
router.use('/api/v1/fees', feeRoutes);

// Health check endpoint
router.get('/api/v1/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
