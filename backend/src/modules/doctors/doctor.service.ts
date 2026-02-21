import Doctor, { IDoctor } from './doctor.model';
import User from '../users/user.model';
import ApiError from '../../utils/ApiError';

class DoctorService {
    async createDoctor(userId: string, doctorData: Partial<IDoctor>): Promise<IDoctor> {
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

    async getAllDoctors(): Promise<IDoctor[]> {
        return await Doctor.find({ isDeleted: false }).populate('userId', 'name email profileImage isActive');
    }

    async getDoctorById(id: string): Promise<IDoctor> {
        const doctor = await Doctor.findOne({ _id: id, isDeleted: false }).populate('userId', 'name email profileImage isActive');
        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }
        return doctor;
    }

    async updateDoctor(id: string, updateData: Partial<IDoctor>): Promise<IDoctor> {
        const doctor = await Doctor.findOneAndUpdate(
            { _id: id, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'name email profileImage isActive');

        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }
        return doctor; // Type coercion naturally handled by generic model return
    }

    async deleteDoctor(id: string): Promise<IDoctor> {
        const doctor = await Doctor.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!doctor) {
            throw new ApiError(404, 'Doctor not found');
        }

        // Also deactivate the user account
        await User.findByIdAndUpdate(doctor.userId, { isActive: false });

        return doctor;
    }
}

export default new DoctorService();
