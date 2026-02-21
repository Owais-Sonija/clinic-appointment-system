const Staff = require('./staff.model');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');

class StaffService {
    async createStaff(userId, staffData) {
        const user = await User.findById(userId);
        if (!user || user.role === 'patient') {
            throw new ApiError(400, "Cannot assign staff module to patient profile.");
        }

        const existing = await Staff.findOne({ userId });
        if (existing) {
            throw new ApiError(400, "Staff record already exists for this user.");
        }

        return await Staff.create({ userId, ...staffData });
    }

    async getAllStaff() {
        return await Staff.find({ isDeleted: false }).populate('userId', 'name email role isActive');
    }

    async getStaffById(id) {
        const staff = await Staff.findOne({ _id: id, isDeleted: false }).populate('userId', 'name email role isActive');
        if (!staff) throw new ApiError(404, "Staff not found");
        return staff;
    }

    async logAttendance(id, attendanceRecord) {
        const staff = await Staff.findById(id);
        if (!staff) throw new ApiError(404, "Staff not found");

        staff.attendance.push(attendanceRecord);
        await staff.save();
        return staff;
    }

    async updateStatus(id, status) {
        const staff = await Staff.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!staff) throw new ApiError(404, "Staff not found");
        return staff;
    }

    async deleteStaff(id) {
        const staff = await Staff.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!staff) throw new ApiError(404, "Staff not found");
        return staff;
    }
}

module.exports = new StaffService();
