import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/authService';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';

// This function is used to register a new user
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        console.log(data)
        const user = await AuthService.register(data);
        res.status(201).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};
// This function is used to login a user
export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const authInfo = await AuthService.login(email, password);
        const { accessToken, refreshToken, user: { password: _, ...user } } = authInfo
        res.cookie('_localNet_refresh_token_', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        res.json({ success: true, accessToken, user });
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

//This function is used to get logged in user data
export const getLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader)
        const token = authHeader?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Access token missing' });
            return;
        }
        const decoded = verifyAccessToken(token) as { userId: string };
        const user = await AuthService.getUserById(decoded.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
}

