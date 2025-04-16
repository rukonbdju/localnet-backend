// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[ERROR] ${status} - ${message}`);
    res.status(status).json({ success: false, message });
};
