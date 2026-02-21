import express from 'express';
import staffController from './staff.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect); // all routes protected
router.use(roleAuth('admin')); // only admin handles staff logic for now

router.post('/', staffController.createProfile);
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);
router.put('/:id', staffController.updateStaff);
router.post('/:id/attendance', staffController.markAttendance);

export default router;
