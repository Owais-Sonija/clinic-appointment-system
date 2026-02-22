import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import authService from './auth.service';
import tokenUtils from '../../utils/generateToken';
import ApiResponse from '../../utils/ApiResponse';
import ApiError from '../../utils/ApiError';
import asyncHandler from '../../utils/asyncHandler';
import User from '../users/user.model';

class AuthController {
    register = asyncHandler(async (req: Request, res: Response) => {
        const user = await authService.registerUser(req.body);

        const { accessToken, refreshToken } = tokenUtils.generateTokens(res, (user._id as unknown) as string);
        await authService.updateRefreshToken((user._id as unknown) as string, refreshToken);

        res.status(201).json(new ApiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken
        }, "User registered successfully"));
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);

        const { accessToken, refreshToken } = tokenUtils.generateTokens(res, (user._id as unknown) as string);
        await authService.updateRefreshToken((user._id as unknown) as string, refreshToken);

        res.status(200).json(new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken
        }, "Login successful"));
    });

    logout = asyncHandler(async (req: Request | any, res: Response) => {
        if (req.user) {
            await authService.updateRefreshToken(req.user._id, "");
        }
        tokenUtils.clearTokens(res);
        res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
    });

    getProfile = asyncHandler(async (req: Request | any, res: Response) => {
        res.status(200).json(new ApiResponse(200, req.user, "User profile retrieved"));
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const rfToken = req.cookies?.refreshToken;
        if (!rfToken) {
            throw new ApiError(401, 'No refresh token provided');
        }

        try {
            const decoded: any = jwt.verify(rfToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret');
            const user = await User.findById(decoded.userId);

            if (!user || user.refreshToken !== rfToken) {
                throw new ApiError(401, 'Invalid refresh token');
            }

            const { accessToken, refreshToken: newRefreshToken } = tokenUtils.generateTokens(res, (user._id as unknown) as string);
            await authService.updateRefreshToken((user._id as unknown) as string, newRefreshToken);

            res.status(200).json(new ApiResponse(200, { accessToken }, "Token refreshed successfully"));
        } catch (error) {
            throw new ApiError(401, 'Refresh token expired or invalid');
        }
    });

    updateProfile = asyncHandler(async (req: Request | any, res: Response) => {
        const { name, phone, bio, hasCompletedTour, gender, dateOfBirth, address } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Update basic user fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (address) user.address = address;
        if (hasCompletedTour !== undefined) user.hasCompletedTour = hasCompletedTour;

        await user.save();

        res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
    });
}

export default new AuthController();
