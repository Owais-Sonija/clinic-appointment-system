import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode ? error.statusCode : 500;
        const message = error.message || 'Internal Server Error';
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        error = new ApiError(404, 'Resource not found');
    }

    const response = {
        success: error.success,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };

    res.status(error.statusCode).json(response);
};
