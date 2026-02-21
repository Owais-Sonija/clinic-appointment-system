const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');
const generateToken = require('../../utils/generateToken');

class AuthService {
    async registerUser(userData) {
        const { name, email, password, role } = userData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ApiError(400, 'User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'patient'
        });

        if (!user) {
            throw new ApiError(500, 'Invalid user data received');
        }

        return user;
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        if (user.isLocked && user.lockUntil > Date.now()) {
            throw new ApiError(403, 'Account is temporarily locked. Try again later.');
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 5) {
                user.isLocked = true;
                user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 mins
            }
            await user.save();
            throw new ApiError(401, 'Invalid email or password');
        }

        // Reset failed attempts & update last login
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = undefined;
        user.lastLogin = Date.now();
        await user.save();

        return user;
    }
}

module.exports = new AuthService();
