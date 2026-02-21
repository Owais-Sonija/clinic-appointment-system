const authService = require('./auth.service');
const { generateTokens, clearTokens } = require('../../utils/generateToken');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');
const jwt = require('jsonwebtoken');

class AuthController {
    register = asyncHandler(async (req, res) => {
        const user = await authService.registerUser(req.body);
        generateTokens(res, user._id);

        res.status(201).json(new ApiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, "User registered successfully"));
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);

        const { refreshToken } = generateTokens(res, user._id);

        // Save refresh token to user model
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json(new ApiResponse(200, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, "Logged in successfully"));
    });

    logout = asyncHandler(async (req, res) => {
        clearTokens(res);

        // If user is logged in, optionally clear their refresh token in DB
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
        }

        res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
    });

    getProfile = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
    });

    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies.refreshToken;
        if (!token) {
            throw new ApiError(401, 'No refresh token provided');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user || user.refreshToken !== token) {
                throw new ApiError(403, 'Invalid refresh token');
            }

            generateTokens(res, user._id);
            res.status(200).json(new ApiResponse(200, null, "Token refreshed successfully"));
        } catch (error) {
            throw new ApiError(403, 'Refresh token expired or invalid');
        }
    });
}

module.exports = new AuthController();
