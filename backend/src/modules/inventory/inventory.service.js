const Inventory = require('./inventory.model');
const ApiError = require('../../utils/ApiError');

class InventoryService {
    async addItem(data) {
        return await Inventory.create(data);
    }

    async getItems(filters = {}) {
        return await Inventory.find({ ...filters, isDeleted: false });
    }

    async getLowStockItems() {
        return await Inventory.find({ isDeleted: false, $expr: { $lte: ["$stockQuantity", "$reorderLevel"] } });
    }

    async getItemById(id) {
        const item = await Inventory.findOne({ _id: id, isDeleted: false });
        if (!item) throw new ApiError(404, "Inventory item not found");
        return item;
    }

    async updateItem(id, updateData) {
        const item = await Inventory.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
        if (!item) throw new ApiError(404, "Inventory item not found");
        return item;
    }

    async deductStock(itemId, quantity) {
        const item = await Inventory.findOne({ _id: itemId, isDeleted: false });
        if (!item) throw new ApiError(404, "Inventory item not found");

        if (item.stockQuantity < quantity) {
            throw new ApiError(400, `Not enough stock for ${item.itemName}. Current stock: ${item.stockQuantity}`);
        }

        item.stockQuantity -= quantity;
        await item.save();

        // Check if low stock threshold crossed logic here
        // E.g., if (item.stockQuantity <= item.reorderLevel) trigger notification event

        return item;
    }

    async deleteItem(id) {
        const item = await Inventory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!item) throw new ApiError(404, "Inventory item not found");
        return item;
    }
}

module.exports = new InventoryService();
