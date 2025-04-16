import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError';
import { User } from '../models/user';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

export const register = async (name: string, email: string, password: string) => {
    const existing = await User.findOne({ email });
    if (existing) throw new AppError("User already exists", 409)
    if (password.length < 6) throw new AppError("Password must be at least 6 characters", 400)

    const user = new User({ name, email, password });
    const newUser = await user.save();
    if (!newUser) throw new AppError("User not created", 500)
    return user;
};

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404)
    }
    if (await bcrypt.compare(password, user.password)) {
        throw new AppError("Invalid credentials", 401)
    }

    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    return { accessToken, refreshToken };
};
