const inventoryService = require('./inventory.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class InventoryController {
    addItem = asyncHandler(async (req, res) => {
        const item = await inventoryService.addItem(req.body);
        res.status(201).json(new ApiResponse(201, item, "Inventory item added"));
    });

    getItems = asyncHandler(async (req, res) => {
        const items = await inventoryService.getItems(req.query);
        res.status(200).json(new ApiResponse(200, items, "Inventory items retrieved"));
    });

    getLowStockItems = asyncHandler(async (req, res) => {
        const items = await inventoryService.getLowStockItems();
        res.status(200).json(new ApiResponse(200, items, "Low stock items retrieved"));
    });

    getItemById = asyncHandler(async (req, res) => {
        const item = await inventoryService.getItemById(req.params.id);
        res.status(200).json(new ApiResponse(200, item, "Inventory item retrieved"));
    });

    updateItem = asyncHandler(async (req, res) => {
        const item = await inventoryService.updateItem(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, item, "Inventory item updated"));
    });

    deleteItem = asyncHandler(async (req, res) => {
        await inventoryService.deleteItem(req.params.id);
        res.status(200).json(new ApiResponse(200, null, "Inventory item deleted"));
    });

    deductStock = asyncHandler(async (req, res) => {
        const { quantity } = req.body;
        const item = await inventoryService.deductStock(req.params.id, quantity);
        res.status(200).json(new ApiResponse(200, item, "Stock deducted successfully"));
    });
}

module.exports = new InventoryController();
