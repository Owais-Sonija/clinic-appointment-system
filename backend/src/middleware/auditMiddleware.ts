import { Request, Response, NextFunction } from 'express';
import AuditLog from '../modules/auditLogs/auditLog.model';

/**
 * Reusable audit logging middleware factory.
 * Usage: router.post('/', auditAction('CREATE', 'Appointment'), controller.create);
 */
export const auditAction = (action: string, entity: string) => {
    return async (req: Request | any, _res: Response, next: NextFunction) => {
        // Store original json method to intercept the response
        const originalJson = _res.json.bind(_res);
        _res.json = function (body: any) {
            // Log after successful response
            if (_res.statusCode < 400 && req.user) {
                const entityId = body?.data?._id || req.params?.id;
                AuditLog.create({
                    action,
                    userId: req.user._id,
                    role: req.user.role,
                    entity,
                    entityId,
                    ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
                    details: `${action} ${entity}${entityId ? ' ID:' + entityId : ''}`
                }).catch(() => { }); // Fire-and-forget
            }
            return originalJson(body);
        };
        next();
    };
};
