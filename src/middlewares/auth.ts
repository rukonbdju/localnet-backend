import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies._localNet_access_token_;
    const refreshToken = req.cookies._localNet_refresh_token_;
    const token = accessToken || refreshToken;
    if (!token) {
        res.status(401).json({ message: 'Access denied!\nUser is not authenticated!' });
        return;
    }

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET) as { userId: string };
        if (decoded.userId) next()
        else {
            res.status(401).json({ message: 'Access denied!\nUser is not authenticated!' });
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new AppError('Invalid token', 401);
    }
};
