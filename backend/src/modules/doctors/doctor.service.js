const Doctor = require('./doctor.model');
const User = require('../users/user.model');
const ApiError = require('../../utils/ApiError');

class DoctorService {
    async createDoctor(userId, doctorData) {
        // Verify user exists and is a doctor
        const user = await User.findById(userId);
        if (!user || user.role !== 'doctor') {
            throw new ApiError(400, 'User is not a valid doctor account');
        }

        const doctorExists = await Doctor.findOne({ userId });
        if (doctorExists) {
            throw new ApiError(400, 'Doctor profile already exists for this user');
        }

        return await Doctor.create({
            userId,
            ...doctorData
        });
    }

    async getAllDoctors() {
        return await Doctor.find({ isDeleted: false }).populate('userId', 'name email profileImage isActive');
    }

    async getDoctorById(id) {
        const doctor = await Doctor.findOne({ _id: id, isDeleted: false }).populate('userId', 'name email profileImage isActive');
        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }
        return doctor;
    }

    async updateDoctor(id, updateData) {
        const doctor = await Doctor.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email profileImage isActive');

        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }
        return doctor;
    }

    async deleteDoctor(id) {
        const doctor = await Doctor.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }

        // Also deactivate the user account
        await User.findByIdAndUpdate(doctor.userId, { isActive: false });

        return doctor;
    }
}

module.exports = new DoctorService();
