import express from 'express';
import inventoryController from './inventory.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorizeRoles as roleAuth } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(protect); // All routes require auth

// Only Admin, Doctor, or Receptionist can view and adjust stock
router.get('/', roleAuth('admin', 'doctor', 'receptionist', 'nurse'), inventoryController.getInventory);
router.get('/alerts/low-stock', roleAuth('admin', 'receptionist'), inventoryController.getLowStock);
router.get('/:id', roleAuth('admin', 'doctor', 'receptionist', 'nurse'), inventoryController.getItemById);

router.post('/', roleAuth('admin'), inventoryController.addItem);
router.put('/:id', roleAuth('admin'), inventoryController.updateItem);
router.delete('/:id', roleAuth('admin'), inventoryController.deleteItem);

// specific endpoint for deducting/adding stock without updating whole item
router.patch('/:id/adjust', roleAuth('admin', 'doctor', 'nurse'), inventoryController.adjustStock);

export default router;
