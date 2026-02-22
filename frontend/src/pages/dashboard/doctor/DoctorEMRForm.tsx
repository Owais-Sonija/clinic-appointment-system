import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../components/LoadingSpinner';

const DoctorEMRForm = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: appointment, isLoading: loadingAppt } = useQuery({
        queryKey: ['appointment', appointmentId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/api/appointments/${appointmentId}`);
            return res.data.data;
        },
        enabled: !!appointmentId
    });

    const [formData, setFormData] = useState({
        vitals: { bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' },
        symptoms: '',
        diagnosis: '',
        notes: '',
        prescriptions: [{ medicineName: '', dosage: '', frequency: '', duration: '' }]
    });

    const handleVitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, vitals: { ...formData.vitals, [e.target.name]: e.target.value } });
    };

    const handlePrescriptionChange = (index: number, field: string, value: string) => {
        const updated = [...formData.prescriptions];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, prescriptions: updated });
    };

    const addPrescription = () => {
        setFormData({ ...formData, prescriptions: [...formData.prescriptions, { medicineName: '', dosage: '', frequency: '', duration: '' }] });
    };

    const removePrescription = (index: number) => {
        const updated = formData.prescriptions.filter((_, i) => i !== index);
        setFormData({ ...formData, prescriptions: updated.length ? updated : [{ medicineName: '', dosage: '', frequency: '', duration: '' }] });
    };

    const saveMutation = useMutation({
        mutationFn: (payload: any) => axiosInstance.post(`/api/emr`, payload),
        onSuccess: () => {
            toast.success('Medical Record created and appointment completed');
            queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
            navigate('/doctor/appointments');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to save EMR');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            patientId: appointment.patientId?._id,
            doctorId: appointment.doctorId?._id,
            appointmentId: appointment._id,
            visitDate: new Date(),
            vitals: {
                bloodPressure: formData.vitals.bloodPressure,
                heartRate: Number(formData.vitals.heartRate) || undefined,
                temperature: Number(formData.vitals.temperature) || undefined,
                weight: Number(formData.vitals.weight) || undefined,
                height: Number(formData.vitals.height) || undefined,
            },
            symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
            diagnosis: formData.diagnosis,
            notes: formData.notes,
            prescriptions: formData.prescriptions.filter(p => p.medicineName.trim() !== '')
        };

        if (!payload.diagnosis) {
            toast.warning('Diagnosis is required.');
            return;
        }

        saveMutation.mutate(payload);
    };

    if (loadingAppt) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition">
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Medical Record</h1>
                    <p className="text-gray-500 font-medium">Completing appointment for {appointment?.patientId?.name}</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                    {/* Vitals Section */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-6">Patient Vitals</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">BP</label>
                                <input type="text" name="bloodPressure" value={formData.vitals.bloodPressure} onChange={handleVitalChange} placeholder="120/80" className="w-full p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pulse</label>
                                <input type="number" name="heartRate" value={formData.vitals.heartRate} onChange={handleVitalChange} placeholder="72" className="w-full p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Temp</label>
                                <input type="number" step="0.1" name="temperature" value={formData.vitals.temperature} onChange={handleVitalChange} placeholder="36.5" className="w-full p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Weight</label>
                                <input type="number" step="0.1" name="weight" value={formData.vitals.weight} onChange={handleVitalChange} placeholder="70" className="w-full p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Height</label>
                                <input type="number" step="0.1" name="height" value={formData.vitals.height} onChange={handleVitalChange} placeholder="175" className="w-full p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                            </div>
                        </div>
                    </section>

                    {/* Assessment */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Clinical Assessment</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Symptoms</label>
                                <input type="text" value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} placeholder="Cough, Fever, Shortness of breath" className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary font-medium" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Diagnosis <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="Enter primary diagnosis..." className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary font-bold" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Clinical Notes</label>
                                <textarea rows={4} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Enter detailed consultation notes..." className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary font-medium resize-none"></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Prescriptions */}
                    <section>
                        <div className="flex justify-between items-center border-b pb-3 mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Medications</h3>
                            <button type="button" onClick={addPrescription} className="bg-blue-50 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition flex items-center gap-2">
                                <FaPlus /> Add Medication
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.prescriptions.map((px, index) => (
                                <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                                    <div className="flex-grow">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Medicine</label>
                                        <input type="text" value={px.medicineName} onChange={(e) => handlePrescriptionChange(index, 'medicineName', e.target.value)} placeholder="e.g. Amoxicillin 500mg" className="w-full p-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Dosage</label>
                                        <input type="text" value={px.dosage} onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)} placeholder="1 tab" className="w-full p-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                    </div>
                                    <div className="w-full md:w-40">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Frequency</label>
                                        <input type="text" value={px.frequency} onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)} placeholder="TID (3x daily)" className="w-full p-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Days</label>
                                        <input type="text" value={px.duration} onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)} placeholder="7 days" className="w-full p-2.5 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                    </div>
                                    <button type="button" onClick={() => removePrescription(index)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition absolute -top-2 -right-2 md:static md:translate-x-0 md:translate-y-0 shadow-sm md:shadow-none">
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="px-8 py-3 rounded-xl font-bold bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button type="submit" disabled={saveMutation.isPending} className="bg-primary text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                        <FaSave /> {saveMutation.isPending ? 'Saving...' : 'Finalize & Complete'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorEMRForm;
