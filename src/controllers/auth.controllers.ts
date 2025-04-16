import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/authService';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const user = await AuthService.register(name, email, password);
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

// This function is used to refresh the access token using the refresh token
// It verifies the refresh token and generates a new access token and refresh  token
// It returns the new access token and refresh token in the response


export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const decoded = verifyRefreshToken(token) as { userId: string };
        const newAccessToken = signAccessToken(decoded.userId);
        const newRefreshToken = signRefreshToken(decoded.userId);
        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

