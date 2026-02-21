import { Request, Response } from 'express';
import User from './user.model';
import asyncHandler from '../../utils/asyncHandler';
import ApiResponse from '../../utils/ApiResponse';

class UserController {
    // Get all users (Admin only)
    getUsers = asyncHandler(async (req: Request | any, res: Response) => {
        const query: any = { isDeleted: false };
        if (req.query.role) query.role = req.query.role;

        const users = await User.find(query).select('-password');
        res.status(200).json(new ApiResponse(200, users, "Users retrieved"));
    });

    // Get specific user
    getUserById = asyncHandler(async (req: Request | any, res: Response) => {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) throw new Error('User not found');
        res.status(200).json(new ApiResponse(200, user, "User retrieved"));
    });
}

export default new UserController();
