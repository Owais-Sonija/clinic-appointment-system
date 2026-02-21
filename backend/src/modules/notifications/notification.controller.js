const notificationService = require('./notification.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class NotificationController {
    getUserNotifications = asyncHandler(async (req, res) => {
        const notifications = await notificationService.getNotifications(req.user._id);
        res.status(200).json(new ApiResponse(200, notifications, "Notifications retrieved successfully"));
    });

    markRead = asyncHandler(async (req, res) => {
        const notification = await notificationService.markAsRead(req.params.id);
        res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
    });
}

module.exports = new NotificationController();
