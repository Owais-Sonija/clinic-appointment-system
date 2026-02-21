import express from 'express';
import notificationController from './notification.controller';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getUserNotifications);
router.patch('/:id/read', notificationController.markRead);

export default router;
