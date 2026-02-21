const express = require('express');
const router = express.Router();
const emrController = require('./medicalRecord.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

router.use(protect);

// Doctors and Admins can create and edit.
router.post('/', authorizeRoles('admin', 'doctor'), emrController.createRecord);
router.put('/:id', authorizeRoles('admin', 'doctor'), emrController.updateRecord);
router.delete('/:id', authorizeRoles('admin', 'doctor'), emrController.deleteRecord);

// Patients can view their own history. Doctors/Admins/Receptionists can view any.
// Note: We leave parameter `patientId` accessible; authorization logic inside service 
// or controller could be hardened to verify if user = patientId if role is patient.
router.get('/patient/:patientId', emrController.getPatientHistory);
router.get('/:id', emrController.getRecordById);

module.exports = router;
