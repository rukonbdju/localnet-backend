import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError';
import { User } from '../models/user';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

export const register = async (email: string, password: string) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Email already in use');

    const user = await User.create({ email, password });
    return user;
};

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404)
    }
    if (await bcrypt.compare(password, user.password)) {

    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    return { accessToken, refreshToken };
};
