import { NextFunction, Request, Response } from "express";

// middlewares/notFound.ts
export const notFound = (req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({ success: false, message: 'Route not found' });
};
