import express from 'express';
import emrController from './medicalRecord.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect); // All EMR routes require authentication

router.post('/', roleAuth('doctor', 'admin'), emrController.create);
router.get('/patient/:patientId(.*)?', emrController.getPatientHistory);
router.get('/:id', emrController.getById);
router.put('/:id', roleAuth('doctor', 'admin'), emrController.update);
router.delete('/:id', roleAuth('admin'), emrController.deleteRecord);

export default router;
