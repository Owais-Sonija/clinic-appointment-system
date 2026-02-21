import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'patient' | 'doctor' | 'admin' | 'receptionist' | 'nurse';
    phone?: string;
    address?: string;
    isActive: boolean;
    lastLogin?: Date;
    profileImage?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshToken?: string;
    failedLoginAttempts: number;
    isLocked: boolean;
    lockUntil?: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin', 'receptionist', 'nurse'],
        default: 'patient'
    },
    phone: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    profileImage: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    refreshToken: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockUntil: { type: Date },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
