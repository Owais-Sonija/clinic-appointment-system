import express from 'express';
import emrController from './medicalRecord.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';
import { auditAction } from '../../middleware/auditMiddleware';

const router = express.Router();

router.use(protect); // All EMR routes require authentication

router.get('/', roleAuth('doctor', 'admin'), emrController.getAll);
router.post('/', roleAuth('doctor', 'admin'), auditAction('CREATE', 'MedicalRecord'), emrController.create);
router.get('/patient', emrController.getPatientHistory);
router.get('/patient/:patientId', emrController.getPatientHistory);
router.get('/:id', emrController.getById);
router.put('/:id', roleAuth('doctor', 'admin'), auditAction('UPDATE', 'MedicalRecord'), emrController.update);
router.delete('/:id', roleAuth('admin'), auditAction('DELETE', 'MedicalRecord'), emrController.deleteRecord);

export default router;
