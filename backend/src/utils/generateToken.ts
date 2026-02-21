import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateTokens = (res: Response, userId: string | object) => {
    const accessTokenSecret = process.env.JWT_SECRET || 'secret';
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || accessTokenSecret;

    // Generate Access Token (short-lived, e.g., 15 minutes)
    const accessToken = jwt.sign({ userId }, accessTokenSecret, {
        expiresIn: '15m'
    });

    // Generate Refresh Token (long-lived, e.g., 7 days)
    const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
        expiresIn: '7d'
    });

    // Set Access Token in Cookie
    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 mins
    });

    // Set Refresh Token in Cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return { accessToken, refreshToken };
};

const clearTokens = (res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
};

export = { generateTokens, clearTokens };
