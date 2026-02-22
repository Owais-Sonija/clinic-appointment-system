import { Router } from 'express';
import contactController from './contact.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles } from '../../middleware/roleMiddleware';

const router = Router();

// Public route for contact form
router.post('/', contactController.submitForm);

// Protected routes for admin to view/manage contact messages
router.get('/', protect, authorizeRoles('admin'), contactController.getMessages);
router.patch('/:id/status', protect, authorizeRoles('admin'), contactController.updateStatus);

export default router;
