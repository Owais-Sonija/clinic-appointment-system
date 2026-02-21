import Inventory, { IInventory } from './inventory.model';
import ApiError from '../../utils/ApiError';

class InventoryService {
    async addItem(data: Partial<IInventory>): Promise<IInventory> {
        return await Inventory.create(data);
    }

    async getInventory(filters = {}): Promise<IInventory[]> {
        return await Inventory.find({ isDeleted: false, ...filters }).sort({ itemName: 1 });
    }

    async getItemById(id: string): Promise<IInventory> {
        const item = await Inventory.findOne({ _id: id, isDeleted: false });
        if (!item) throw new ApiError(404, 'Item not found');
        return item;
    }

    async updateItem(id: string, updateData: Partial<IInventory>): Promise<IInventory> {
        const item = await Inventory.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
        if (!item) throw new ApiError(404, 'Item not found');
        return item;
    }

    async deleteItem(id: string): Promise<IInventory> {
        const item = await Inventory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!item) throw new ApiError(404, 'Item not found');
        return item;
    }

    async adjustStock(id: string, quantityChange: number): Promise<IInventory> {
        const item = await this.getItemById(id);

        if (item.stockQuantity + quantityChange < 0) {
            throw new ApiError(400, `Cannot deduct ${Math.abs(quantityChange)} ${item.unit}. Only ${item.stockQuantity} remaining.`);
        }

        item.stockQuantity += quantityChange;
        await item.save();

        if (item.stockQuantity <= item.reorderLevel) {
            // Future feature: Trigger Notification Service here!
            console.warn(`[ALERT] Inventory item ${item.itemName} is below reorder level. Current stock: ${item.stockQuantity}`);
        }

        return item;
    }

    async getLowStockAlerts(): Promise<IInventory[]> {
        return await Inventory.find({
            isDeleted: false,
            $expr: { $lte: ['$stockQuantity', '$reorderLevel'] }
        });
    }
}

export default new InventoryService();
