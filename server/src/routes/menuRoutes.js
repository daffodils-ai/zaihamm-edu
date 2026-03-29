import express from 'express';
import MenuController from '../controller/MenuController.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import { roleAccessMiddleware } from '../middleware/role_access_middleware.js';
import { ROLES } from '../constants/index.js';

const router = express.Router();

// Create menu
router.post('/',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    MenuController.create.bind(MenuController)
);

// Get all menus
router.get('/',
    authMiddleware,
    MenuController.getAll.bind(MenuController)
);

// Get main menus
router.get('/main/list',
    authMiddleware,
    MenuController.getMainMenus.bind(MenuController)
);

// Get menus with submenus
router.get('/tree/structure',
    authMiddleware,
    MenuController.getMenusWithSubmenus.bind(MenuController)
);

// Get submenus
router.get('/:parentId/submenus',
    authMiddleware,
    MenuController.getSubmenus.bind(MenuController)
);

// Get by ID
router.get('/:id',
    authMiddleware,
    MenuController.getById.bind(MenuController)
);

// Update menu
router.put('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    MenuController.update.bind(MenuController)
);

// Delete menu
router.delete('/:id',
    authMiddleware,
    roleAccessMiddleware([ROLES.ORGANIZATION]),
    MenuController.delete.bind(MenuController)
);

export default router;
