import Staff, { IStaff } from './staff.model';
import User from '../users/user.model';
import ApiError from '../../utils/ApiError';

class StaffService {
    async createStaffProfile(userId: string, staffData: Partial<IStaff>): Promise<IStaff> {
        const user = await User.findById(userId);
        if (!user || !['receptionist', 'nurse', 'admin'].includes(user.role)) {
            throw new ApiError(400, 'User role is not authorized for a staff profile');
        }

        const staffExists = await Staff.findOne({ userId });
        if (staffExists) {
            throw new ApiError(400, 'Staff profile already exists for this user');
        }

        return await Staff.create({ userId, ...staffData });
    }

    async getAllStaff(): Promise<IStaff[]> {
        return await Staff.find().populate('userId', 'name email role isActive');
    }

    async getStaffById(id: string): Promise<IStaff> {
        const staff = await Staff.findById(id).populate('userId', 'name email role isActive');
        if (!staff) throw new ApiError(404, 'Staff not found');
        return staff;
    }

    async updateStaff(id: string, updateData: Partial<IStaff>): Promise<IStaff> {
        const staff = await Staff.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!staff) throw new ApiError(404, 'Staff not found');
        return staff;
    }

    async markAttendance(id: string, status: 'Present' | 'Absent' | 'Leave' | 'Half Day'): Promise<IStaff> {
        const staff = await Staff.findById(id);
        if (!staff) throw new ApiError(404, 'Staff not found');

        // Check if attendance already marked today to prevent duplicates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const markedToday = staff.attendance.find(a => {
            const entryDate = new Date(a.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        });

        if (markedToday) {
            markedToday.status = status;
        } else {
            staff.attendance.push({ date: new Date(), status });
        }

        await staff.save();
        return staff;
    }
}

export default new StaffService();
