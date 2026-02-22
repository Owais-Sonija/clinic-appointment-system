import express from 'express';
import userController from './user.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles } from '../../middleware/roleMiddleware';
import { auditAction } from '../../middleware/auditMiddleware';

const router = express.Router();

// Admin / Receptionist can view users
router.get('/', protect, authorizeRoles('admin', 'receptionist'), userController.getUsers);
router.get('/:id', protect, authorizeRoles('admin', 'receptionist', 'doctor'), auditAction('VIEW_PROFILE', 'User'), userController.getUserById);

export default router;
