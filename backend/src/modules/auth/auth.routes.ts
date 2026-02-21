import express from 'express';
import authController from './auth.controller';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/profile', protect, authController.getProfile);

export default router;
