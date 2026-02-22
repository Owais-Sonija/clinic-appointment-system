import express from 'express';
import auditLogController from './auditLog.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(roleAuth('admin'));

router.get('/', auditLogController.getAll);
router.get('/:entity/:entityId', auditLogController.getByEntity);

export default router;
