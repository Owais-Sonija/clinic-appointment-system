import { Request, Response } from 'express';
import inventoryService from './inventory.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class InventoryController {
    addItem = asyncHandler(async (req: Request, res: Response) => {
        const item = await inventoryService.addItem(req.body);
        res.status(201).json(new ApiResponse(201, item, "Inventory item created successfully"));
    });

    getInventory = asyncHandler(async (req: Request, res: Response) => {
        const category = req.query.category;
        const filters = category ? { category } : {};
        const items = await inventoryService.getInventory(filters);
        res.status(200).json(new ApiResponse(200, items, "Inventory fetched successfully"));
    });

    getItemById = asyncHandler(async (req: Request, res: Response) => {
        const item = await inventoryService.getItemById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, item, "Item retrieved"));
    });

    updateItem = asyncHandler(async (req: Request, res: Response) => {
        const item = await inventoryService.updateItem((req.params.id as string), req.body);
        res.status(200).json(new ApiResponse(200, item, "Item updated"));
    });

    deleteItem = asyncHandler(async (req: Request, res: Response) => {
        await inventoryService.deleteItem((req.params.id as string));
        res.status(200).json(new ApiResponse(200, null, "Item marked as deleted"));
    });

    adjustStock = asyncHandler(async (req: Request, res: Response) => {
        const { quantityChange } = req.body; // positive to add, negative to deduct
        const item = await inventoryService.adjustStock((req.params.id as string), quantityChange);
        res.status(200).json(new ApiResponse(200, item, "Stock adjusted successfully"));
    });

    getLowStock = asyncHandler(async (req: Request, res: Response) => {
        const items = await inventoryService.getLowStockAlerts();
        res.status(200).json(new ApiResponse(200, items, "Low stock items retrieved"));
    });
}

export default new InventoryController();
