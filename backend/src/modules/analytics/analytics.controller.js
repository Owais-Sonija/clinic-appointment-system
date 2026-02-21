const analyticsService = require('./analytics.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class AnalyticsController {
    getDashboardMetrics = asyncHandler(async (req, res) => {
        const metrics = await analyticsService.getAdminDashboardMetrics();
        res.status(200).json(new ApiResponse(200, metrics, "Admin dashboard metrics retrieved successfully."));
    });
}

module.exports = new AnalyticsController();
