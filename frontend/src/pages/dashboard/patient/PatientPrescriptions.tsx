import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FaPills, FaUserMd, FaCalendarDay } from 'react-icons/fa';
import EmptyState from '../../../components/EmptyState';

const PatientPrescriptions = () => {
    const fetchPrescriptions = async () => {
        const res = await axiosInstance.get('/api/patient/prescriptions');
        return res.data.data;
    };

    const { data: prescriptions = [], isLoading } = useQuery({
        queryKey: ['patient-prescriptions'],
        queryFn: fetchPrescriptions
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-in">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
                <p className="text-gray-500 mt-1">Manage your active and past prescribed medications.</p>
            </div>

            {prescriptions.length === 0 ? (
                <EmptyState
                    title="No Prescriptions Found"
                    description="You do not have any medication history recorded."
                    icon="💊"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prescriptions.map((rx: any, index: number) => (
                        <div key={`${rx.recordId}-${index}`} className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md transition">
                            <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                                    <FaPills />
                                </div>
                                <div>
                                    <h3 className="font-bold text-emerald-900 text-lg">{rx.medicine}</h3>
                                    <p className="text-emerald-700 font-semibold text-sm">{rx.dosage}</p>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-gray-500 text-sm font-medium">Frequency</span>
                                    <span className="font-bold text-gray-900">{rx.frequency}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="text-gray-500 text-sm font-medium">Duration</span>
                                    <span className="font-bold text-gray-900">{rx.duration}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaUserMd className="text-blue-500" />
                                        <p className="text-sm font-bold text-gray-900">Dr. {rx.doctorName}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendarDay className="text-orange-400" />
                                        <p className="text-xs text-gray-500">Prescribed: {new Date(rx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientPrescriptions;
