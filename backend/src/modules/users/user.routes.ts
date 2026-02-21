import express from 'express';
import userController from './user.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles } from '../../middleware/roleMiddleware';

const router = express.Router();

// Admin / Receptionist can view users
router.get('/', protect, authorizeRoles('admin', 'receptionist'), userController.getUsers);
router.get('/:id', protect, authorizeRoles('admin', 'receptionist', 'doctor'), userController.getUserById);

export default router;
