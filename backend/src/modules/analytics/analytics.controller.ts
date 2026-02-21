import { Request, Response } from 'express';
import analyticsService from './analytics.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class AnalyticsController {
    getDashboard = asyncHandler(async (req: Request, res: Response) => {
        const metrics = await analyticsService.getDashboardMetrics();
        res.status(200).json(new ApiResponse(200, metrics, "Dashboard metrics retrieved"));
    });
}

export default new AnalyticsController();
