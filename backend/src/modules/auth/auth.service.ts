import User, { IUser } from '../users/user.model';
import ApiError from '../../utils/ApiError';

class AuthService {
    async registerUser(userData: Partial<IUser>): Promise<IUser> {
        const { name, email, password, phone } = userData;

        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new ApiError(400, 'User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'patient', // Force role = patient per Phase 5 specs
            isActive: true
        });

        return user;
    }

    async loginUser(email: string, password: string): Promise<IUser> {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        if (user.isLocked && user.lockUntil && user.lockUntil.getTime() > Date.now()) {
            throw new ApiError(403, 'Account is temporarily locked. Try again later.');
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 5) {
                user.isLocked = true;
                user.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // Lock for 1 hour per Phase 5 specs
            }
            await user.save();
            throw new ApiError(401, 'Invalid email or password');
        }

        // Reset failed attempts & update last login
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        return user;
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { refreshToken });
    }
}

export default new AuthService();
