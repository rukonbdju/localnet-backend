import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/authService';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.register(email, password);
        res.status(201).json({ success: true, user: { email: user.email } });
    } catch (err) {
        next(err);
    }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const tokens = await AuthService.login(email, password);
        res.json({ success: true, ...tokens });
    } catch (err) {
        next(err);
    }
};

