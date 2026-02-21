import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request | any, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(403, `Role (${req.user ? req.user.role : 'Unknown'}) is not authorized to access this resource`));
        }
        next();
    };
};
