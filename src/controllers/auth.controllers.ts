import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/authService';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';

// This function is used to register a new user
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        console.log(data)
        const registeredUser = await AuthService.register(data);
        const authInfo = await AuthService.login(registeredUser.email, data.password);
        const { accessToken, refreshToken, user: { password: _, ...user } } = authInfo
        // Set the access token as a cookie with httpOnly and secure flags
        res.cookie('_localNet_access_token_', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to true in production

        })
        // Set the refresh token as a cookie with httpOnly and secure flags
        res.cookie('_localNet_refresh_token_', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        })
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
        // Set the access token as a cookie with httpOnly and secure flags
        res.cookie('_localNet_access_token_', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to true in production

        })
        // Set the refresh token as a cookie with httpOnly and secure flags
        res.cookie('_localNet_refresh_token_', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        })
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};
// This function is used to logout a user
// It clears the access token and refresh token cookies from the client side
export const signout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('_localNet_access_token_');
        res.clearCookie('_localNet_refresh_token_');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to logout' });
    }
}

// This function is used to refresh the access token using the refresh token
// It verifies the refresh token and generates a new access token and refresh  token
// It returns the new access token and refresh token in the response
export const refreshToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const decoded = verifyRefreshToken(token) as { userId: string };
        const newAccessToken = signAccessToken(decoded.userId);
        // Set the access token as a cookie with httpOnly and secure flags
        res.cookie('_localNet_access_token_', newAccessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Set to true in production
        })
        res.json({ accessToken: newAccessToken });
    } catch {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

//This function is used to get logged in user data
export const getLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies._localNet_access_token_ || req.cookies._localNet_refresh_token_;
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

