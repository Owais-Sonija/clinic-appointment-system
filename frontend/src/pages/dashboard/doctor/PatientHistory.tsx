import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { FaArrowLeft, FaHistory, FaPrescription, FaNotesMedical, FaUser } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';

const PatientHistory = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const { data: history, isLoading } = useQuery({
        queryKey: ['patient-history', patientId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/api/doctor/patients/${patientId}/history`);
            return res.data.data;
        },
        enabled: !!patientId
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition">
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clinical History</h1>
                    <p className="text-gray-500 font-medium">Full medical timeline for patient</p>
                </div>
            </header>

            {history?.length > 0 ? (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {history.map((record: any, idx: number) => (
                        <div key={record._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-primary z-10">
                                <FaNotesMedical />
                            </div>
                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
                                <div className="flex items-center justify-between mb-4">
                                    <time className="text-sm font-bold text-gray-400">{new Date(record.visitDate || record.createdAt).toLocaleDateString()}</time>
                                    <span className="text-xs font-bold text-primary px-2 py-0.5 bg-blue-50 rounded-full">Record #{idx + 1}</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-900 leading-tight">{record.diagnosis}</h4>
                                        <p className="text-sm text-gray-500 italic">Dr. {record.doctorId?.userId?.name || record.doctorId?.name}</p>
                                    </div>

                                    {record.symptoms?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {record.symptoms.map((s: string, i: number) => (
                                                <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{s}</span>
                                            ))}
                                        </div>
                                    )}

                                    {record.prescriptions?.length > 0 && (
                                        <div className="pt-4 border-t border-gray-50">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                                <FaPrescription /> Prescribed
                                            </p>
                                            <ul className="space-y-2">
                                                {record.prescriptions.map((px: any, i: number) => (
                                                    <li key={i} className="text-sm text-gray-700 font-medium flex justify-between">
                                                        <span>{px.medicineName}</span>
                                                        <span className="text-gray-400 text-xs">{px.dosage} ({px.frequency})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {record.notes && (
                                        <div className="pt-4 border-t border-gray-50 text-sm text-gray-500 line-clamp-3">
                                            {record.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-2xl">
                        <FaHistory />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No History Found</h3>
                    <p className="text-gray-500">This patient has no recorded clinical history yet.</p>
                </div>
            )}
        </div>
    );
};

export default PatientHistory;
