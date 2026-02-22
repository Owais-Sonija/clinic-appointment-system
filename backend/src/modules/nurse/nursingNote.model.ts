import mongoose, { Schema, Document } from 'mongoose';

export interface INursingNote extends Document {
    appointmentId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    nurseId: mongoose.Types.ObjectId;
    observations: string;
    allergies: string;
    medicationsAdministered: string;
    createdAt: Date;
    updatedAt: Date;
}

const nursingNoteSchema: Schema = new Schema({
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    nurseId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    observations: { type: String, required: true },
    allergies: { type: String },
    medicationsAdministered: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<INursingNote>('NursingNote', nursingNoteSchema);
