import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError';
import { User } from '../models/user';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

interface UserData {
    name: string;
    email: string;
    password: string;
    address: string;
    country: string;
    city?: string;
    state?: string;
    district?: string;
    village?: string;
    countryCode?: string;
    geolocation: { lat: number; lng: number };
}
//user register
export const register = async (userData: UserData) => {
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw new AppError("User already exists", 409)
    if (userData.password.length < 6) throw new AppError("Password must be at least 6 characters", 400)
    const primaryGeolocation = { coordinates: [Number(userData.geolocation.lng), Number(userData.geolocation.lat)] }
    const currentGeolocation = primaryGeolocation;
    const lastGeolocation = primaryGeolocation;
    const user = new User({ ...userData, primaryGeolocation, currentGeolocation, lastGeolocation });
    const newUser = (await user.save()).toObject();
    const { password, ...restData } = newUser;
    if (!newUser) throw new AppError("User not created", 500)
    return restData;
};

//user login
export const login = async (email: string, password: string) => {
    const user = await User.findOne({ email }).lean();
    if (!user) {
        throw new AppError("User not found", 404)
    }
    const pass = await bcrypt.compare(password, user.password)
    if (!pass) {
        throw new AppError("Invalid credentials", 401)
    }
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());
    return { accessToken, refreshToken, user };
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) throw new AppError("User not found", 404)
    return user;
}
