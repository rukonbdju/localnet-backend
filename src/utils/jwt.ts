import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
//sign a new access token
export const signAccessToken = (userId: string) => {
    return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '1h' });
};
//validate the access token
export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET);
};
//sign a new refresh token
export const signRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};
//validate the refresh token
export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET);
};
