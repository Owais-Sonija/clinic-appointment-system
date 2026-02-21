const express = require('express');
const router = express.Router();
const inventoryController = require('./inventory.controller');
const { protect } = require('../../middleware/authMiddleware');
const { authorizeRoles } = require('../../middleware/roleMiddleware');

router.use(protect); // Only staff should access inventory
router.use(authorizeRoles('admin', 'receptionist', 'nurse', 'doctor')); // Patients shouldn't access

router.post('/', authorizeRoles('admin', 'receptionist'), inventoryController.addItem);
router.get('/', inventoryController.getItems);
router.get('/alerts/low-stock', inventoryController.getLowStockItems);
router.get('/:id', inventoryController.getItemById);
router.put('/:id', authorizeRoles('admin', 'receptionist'), inventoryController.updateItem);
router.delete('/:id', authorizeRoles('admin'), inventoryController.deleteItem);

// specific route for usage deduction (e.g. Doctor prescribing / Nurse using)
router.post('/:id/deduct', authorizeRoles('admin', 'doctor', 'nurse', 'receptionist'), inventoryController.deductStock);

module.exports = router;
