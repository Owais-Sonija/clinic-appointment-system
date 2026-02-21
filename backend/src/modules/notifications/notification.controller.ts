import { Request, Response } from 'express';
import notificationService from './notification.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class NotificationController {
    getUserNotifications = asyncHandler(async (req: Request | any, res: Response) => {
        const notifications = await notificationService.getNotifications(req.user._id);
        res.status(200).json(new ApiResponse(200, notifications, "Notifications retrieved successfully"));
    });

    markRead = asyncHandler(async (req: Request, res: Response) => {
        const notification = await notificationService.markAsRead((req.params.id as string));
        res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"));
    });
}

export default new NotificationController();
