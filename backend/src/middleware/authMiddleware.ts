import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler';
import User from '../modules/users/user.model';
import ApiError from '../utils/ApiError';

export const protect = asyncHandler(async (req: Request | any, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        throw new ApiError(401, 'Not authorized, no token provided');
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || user.isDeleted) {
            throw new ApiError(401, 'Not authorized, user not found');
        }

        if (!user.isActive) {
            throw new ApiError(401, 'Not authorized, your account has been deactivated');
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'Not authorized, token failed');
    }
});

export const restrictTo = (...roles: string[]) => {
    return (req: Request | any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'You do not have permission to perform this action');
        }
        next();
    };
};
