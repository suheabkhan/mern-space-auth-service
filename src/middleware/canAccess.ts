import createHttpError from 'http-errors';
import { AuthRequest } from '../types/index';
import { NextFunction, Request, Response } from 'express';

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const roleFromToken = _req.auth.role;
        if (!roles.includes(roleFromToken)) {
            const invalidAccessError = createHttpError(
                403,
                'you have no valid access to perform this operation',
            );
            return next(invalidAccessError);
        }
        next();
    };
};
