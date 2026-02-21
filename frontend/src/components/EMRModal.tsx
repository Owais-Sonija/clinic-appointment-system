import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash, FaSave, FaFilePdf } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EMRModalProps {
    appointment: any;
    isOpen: boolean;
    onClose: () => void;
}

const EMRModal: React.FC<EMRModalProps> = ({ appointment, isOpen, onClose }) => {
    const queryClient = useQueryClient();

    // Check if EMR already exists for this appointment
    const { data: existingEMR, isLoading: loadingEMR } = useQuery({
        queryKey: ['emr', appointment?._id],
        queryFn: async () => {
            if (!appointment?._id) return null;
            try {
                // If backend does not have get by appointment ID, we might need to filter patient's history
                // Assuming we can get patient history and find the one matching appointmentId:
                const res = await axiosInstance.get(`/api/emr/patient/${appointment.patientId?._id}`);
                const records = res.data?.data || [];
                return records.find((r: any) => r.appointmentId === appointment._id) || null;
            } catch (err) {
                return null;
            }
        },
        enabled: !!appointment?._id && isOpen
    });

    const [formData, setFormData] = useState({
        vitals: { bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' },
        symptoms: '',
        diagnosis: '',
        notes: '',
        prescriptions: [{ medicineName: '', dosage: '', frequency: '', duration: '' }]
    });

    useEffect(() => {
        if (existingEMR) {
            setFormData({
                vitals: existingEMR.vitals || { bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' },
                symptoms: existingEMR.symptoms?.join(', ') || '',
                diagnosis: existingEMR.diagnosis || '',
                notes: existingEMR.notes || '',
                prescriptions: existingEMR.prescriptions?.length ? existingEMR.prescriptions : [{ medicineName: '', dosage: '', frequency: '', duration: '' }]
            });
        } else {
            setFormData({
                vitals: { bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '' },
                symptoms: '',
                diagnosis: '',
                notes: '',
                prescriptions: [{ medicineName: '', dosage: '', frequency: '', duration: '' }]
            });
        }
    }, [existingEMR, isOpen]);

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
        mutationFn: async (payload: any) => {
            if (existingEMR) {
                return axiosInstance.put(`/api/emr/${existingEMR._id}`, payload);
            } else {
                return axiosInstance.post(`/api/emr`, payload);
            }
        },
        onSuccess: () => {
            toast.success('Medical Record saved successfully');
            queryClient.invalidateQueries({ queryKey: ['emr', appointment?._id] });
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to save EMR');
        }
    });

    const handleSubmit = () => {
        const payload = {
            patientId: appointment.patientId?._id,
            doctorId: appointment.doctorId?._id,
            appointmentId: appointment._id,
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

        // Basic validation
        if (!payload.diagnosis) {
            toast.warning('Diagnosis is required to save a medical record.');
            return;
        }

        saveMutation.mutate(payload);
    };

    const handleGeneratePDF = () => {
        if (!existingEMR) {
            toast.error("Please save the record first before generating PDF.");
            return;
        }

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185);
        doc.text('Clinic Appointment System', 105, 20, { align: 'center' });

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Medical Prescription', 105, 30, { align: 'center' });

        // Patient & Doctor Info
        doc.setFontSize(12);
        doc.text(`Patient Name: ${appointment.patientId?.name}`, 14, 45);
        doc.text(`Doctor: Dr. ${appointment.doctorId?.userId?.name}`, 14, 53);
        doc.text(`Date: ${new Date(existingEMR.createdAt).toLocaleDateString()}`, 14, 61);

        // Vitals
        doc.setFontSize(14);
        doc.text('Vitals Summary', 14, 75);
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`BP: ${existingEMR.vitals?.bloodPressure || 'N/A'} | HR: ${existingEMR.vitals?.heartRate || 'N/A'} bpm | Temp: ${existingEMR.vitals?.temperature || 'N/A'} °C`, 14, 82);

        // Diagnosis
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Primary Diagnosis', 14, 95);
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(existingEMR.diagnosis || 'N/A', 14, 102);

        // Prescriptions Table
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Prescribed Medication', 14, 115);

        const tableColumn = ["Medicine", "Dosage", "Frequency", "Duration"];
        const tableRows = existingEMR.prescriptions?.map((p: any) => [
            p.medicineName,
            p.dosage,
            p.frequency,
            p.duration
        ]) || [];

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 120,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 120;

        if (existingEMR.notes) {
            doc.setFontSize(14);
            doc.text('Consultation Notes', 14, finalY + 15);
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const splitNotes = doc.splitTextToSize(existingEMR.notes, 180);
            doc.text(splitNotes, 14, finalY + 22);
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('This is an electronically generated document. Signatures may not be required.', 105, 280, { align: 'center' });

        doc.save(`Prescription_${appointment.patientId?.name.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (!isOpen || !appointment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-bold text-dark flex items-center gap-2">Patient Electronic Medical Record (EMR)</h2>
                        <p className="text-gray-500 text-sm mt-1">Patient: <span className="font-semibold text-dark">{appointment.patientId?.name}</span> | Date: {new Date(appointment.date || appointment.appointmentDate).toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition text-gray-600">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                    {loadingEMR ? (
                        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
                    ) : (
                        <>
                            {/* Vitals Section */}
                            <section>
                                <h3 className="text-lg font-bold text-dark border-b pb-2 mb-4">Vitals Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Blood Pressure</label>
                                        <input type="text" name="bloodPressure" value={formData.vitals.bloodPressure} onChange={handleVitalChange} placeholder="120/80" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Heart Rate (bpm)</label>
                                        <input type="number" name="heartRate" value={formData.vitals.heartRate} onChange={handleVitalChange} placeholder="72" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Temp (°C)</label>
                                        <input type="number" step="0.1" name="temperature" value={formData.vitals.temperature} onChange={handleVitalChange} placeholder="36.5" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Weight (kg)</label>
                                        <input type="number" step="0.1" name="weight" value={formData.vitals.weight} onChange={handleVitalChange} placeholder="70" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Height (cm)</label>
                                        <input type="number" step="0.1" name="height" value={formData.vitals.height} onChange={handleVitalChange} placeholder="175" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition" />
                                    </div>
                                </div>
                            </section>

                            {/* Clinical Assessment */}
                            <section>
                                <h3 className="text-lg font-bold text-dark border-b pb-2 mb-4">Clinical Assessment</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">Symptoms (comma separated)</label>
                                        <input type="text" value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} placeholder="Cough, Fever, Fatigue" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">Primary Diagnosis <span className="text-red-500">*</span></label>
                                        <input type="text" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="Viral Infection" className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">Consultation Notes</label>
                                        <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Patient advised to rest and drink plenty of fluids." className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white resize-none"></textarea>
                                    </div>
                                </div>
                            </section>

                            {/* Prescriptions */}
                            <section>
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="text-lg font-bold text-dark">Prescription Details</h3>
                                    <button onClick={addPrescription} className="text-xs bg-blue-100 text-primary px-3 py-1 rounded-full font-bold hover:bg-blue-200 transition flex items-center gap-1"><FaPlus /> Add Med</button>
                                </div>
                                <div className="space-y-3">
                                    {formData.prescriptions.map((px, index) => (
                                        <div key={index} className="flex gap-2 items-end bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Medicine Name</label>
                                                <input type="text" value={px.medicineName} onChange={(e) => handlePrescriptionChange(index, 'medicineName', e.target.value)} placeholder="Paracetamol 500mg" className="w-full p-2 border rounded text-sm" />
                                            </div>
                                            <div className="w-24">
                                                <label className="text-xs text-gray-500">Dosage</label>
                                                <input type="text" value={px.dosage} onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)} placeholder="1 tablet" className="w-full p-2 border rounded text-sm" />
                                            </div>
                                            <div className="w-32">
                                                <label className="text-xs text-gray-500">Frequency</label>
                                                <input type="text" value={px.frequency} onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)} placeholder="Twice a day" className="w-full p-2 border rounded text-sm" />
                                            </div>
                                            <div className="w-24">
                                                <label className="text-xs text-gray-500">Duration</label>
                                                <input type="text" value={px.duration} onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)} placeholder="5 days" className="w-full p-2 border rounded text-sm" />
                                            </div>
                                            <button onClick={() => removePrescription(index)} className="p-2 mb-0.5 bg-red-100 text-red-500 rounded hover:bg-red-200 transition">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={handleGeneratePDF}
                        disabled={!existingEMR}
                        className={`px-4 py-2 border rounded-lg font-semibold flex items-center gap-2 transition ${existingEMR ? 'bg-white text-primary hover:bg-gray-100 border-primary' : 'bg-white text-gray-400 cursor-not-allowed'}`}
                    >
                        <FaFilePdf /> {existingEMR ? 'Print Prescription' : 'Save First to Print'}
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 border rounded-lg bg-white text-gray-600 font-semibold hover:bg-gray-50 transition">Cancel</button>
                        <button onClick={handleSubmit} disabled={saveMutation.isPending} className="btn-primary flex items-center gap-2">
                            {saveMutation.isPending ? 'Saving...' : <><FaSave /> Save Record</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EMRModal;
