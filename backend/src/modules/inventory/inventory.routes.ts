import express from 'express';
import inventoryController from './inventory.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';
import { auditAction } from '../../middleware/auditMiddleware';

const router = express.Router();

router.use(protect); // All routes require auth

// Only Admin, Doctor, or Receptionist can view and adjust stock
router.get('/', roleAuth('admin', 'doctor', 'receptionist', 'nurse'), inventoryController.getInventory);
router.get('/alerts/low-stock', roleAuth('admin', 'receptionist'), inventoryController.getLowStock);
router.get('/:id', roleAuth('admin', 'doctor', 'receptionist', 'nurse'), inventoryController.getItemById);

router.post('/', roleAuth('admin'), auditAction('CREATE', 'Inventory'), inventoryController.addItem);
router.put('/:id', roleAuth('admin'), auditAction('UPDATE', 'Inventory'), inventoryController.updateItem);
router.delete('/:id', roleAuth('admin'), auditAction('DELETE', 'Inventory'), inventoryController.deleteItem);

// specific endpoint for deducting/adding stock without updating whole item
router.patch('/:id/adjust', roleAuth('admin', 'doctor', 'nurse'), auditAction('ADJUST_STOCK', 'Inventory'), inventoryController.adjustStock);

export default router;
