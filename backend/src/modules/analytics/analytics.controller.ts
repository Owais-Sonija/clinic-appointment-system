import { Request, Response } from 'express';
import analyticsService from './analytics.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class AnalyticsController {
    getDashboard = asyncHandler(async (req: Request, res: Response) => {
        const metrics = await analyticsService.getDashboardMetrics();
        res.status(200).json(new ApiResponse(200, metrics, "Dashboard metrics retrieved"));
    });

    getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
        const [quickStats, revenueTrend, appointmentStats] = await Promise.all([
            analyticsService.getQuickStats(),
            analyticsService.getMonthlyRevenue(),
            analyticsService.getAppointmentStats()
        ]);

        res.status(200).json(new ApiResponse(200, {
            quickStats,
            revenueTrend,
            appointmentStats
        }, "Dashboard analytics retrieved successfully"));
    });
}

export default new AnalyticsController();
