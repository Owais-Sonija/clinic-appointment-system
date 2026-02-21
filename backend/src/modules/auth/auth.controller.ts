import { Request, Response } from 'express';
import authService from './auth.service';
import tokenUtils from '../../utils/generateToken';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

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
            return res.status(401).json(new ApiResponse(401, null, "No refresh token provided"));
        }

        // Detailed refresh logic to be expanded as needed
        res.status(200).json(new ApiResponse(200, null, "Token refresh mechanism ready"));
    });
}

export default new AuthController();
