import { Request, Response } from 'express';
import AuditLog from './auditLog.model';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class AuditLogController {
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const { entity, userId, page = 1, limit = 50 } = req.query;
        const filter: any = {};
        if (entity) filter.entity = entity;
        if (userId) filter.userId = userId;

        const logs = await AuditLog.find(filter)
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const total = await AuditLog.countDocuments(filter);

        res.status(200).json(new ApiResponse(200, { logs, total, page: Number(page), limit: Number(limit) }, 'Audit logs retrieved'));
    });

    getByEntity = asyncHandler(async (req: Request, res: Response) => {
        const { entity, entityId } = req.params;
        const logs = await AuditLog.find({ entity, entityId })
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200, logs, 'Entity audit trail retrieved'));
    });
}

export default new AuditLogController();
