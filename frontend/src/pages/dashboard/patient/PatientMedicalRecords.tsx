import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FaFileMedical, FaUserMd, FaDownload } from 'react-icons/fa';
import EmptyState from '../../../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const PatientMedicalRecords = () => {
    const navigate = useNavigate();

    const fetchRecords = async () => {
        const res = await axiosInstance.get('/api/patient/medical-records');
        return res.data.data;
    };

    const { data: records = [], isLoading } = useQuery({
        queryKey: ['patient-records'],
        queryFn: fetchRecords
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 border-none pb-0">Medical History</h1>
                    <p className="text-gray-500 mt-1">Review your chronological health records and diagnoses.</p>
                </div>
                <button onClick={() => navigate('/patient/book-appointment')} className="btn-primary">
                    Book New Visit
                </button>
            </div>

            {records.length === 0 ? (
                <EmptyState
                    title="No Medical History"
                    description="You don't have any past medical records in the system yet."
                    icon="📋"
                />
            ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent mt-8">
                    {records.map((record: any, index: number) => (
                        <div key={record._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Marker */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-400 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                                <FaFileMedical />
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{record.diagnosis || 'Checkup'}</h3>
                                        <p className="text-sm font-semibold text-gray-400 mt-1">
                                            {new Date(record.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-primary transition bg-gray-50 rounded-lg hover:bg-blue-50" title="Download Report">
                                        <FaDownload />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-1">Symptoms:</h4>
                                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">{record.symptoms || 'N/A'}</p>
                                    </div>
                                    {record.treatmentPlan && (
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Treatment Plan:</h4>
                                            <p className="text-gray-600">{record.treatmentPlan}</p>
                                        </div>
                                    )}

                                    {record.prescriptions && record.prescriptions.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-700 mb-2">Prescribed Medications:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {record.prescriptions.map((rx: any, idx: number) => (
                                                    <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
                                                        💊 {rx.medicine} ({rx.dosage}) - {rx.frequency}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                        <FaUserMd />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Dr. {record.doctorId?.userId?.name}</p>
                                        <p className="text-xs text-gray-500">{record.doctorId?.specialization}</p>
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

export default PatientMedicalRecords;
