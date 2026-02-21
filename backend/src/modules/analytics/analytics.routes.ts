import express from 'express';
import analyticsController from './analytics.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(roleAuth('admin')); // Only admins can view overarching clinic analytics

router.get('/dashboard', analyticsController.getDashboard);

export default router;
