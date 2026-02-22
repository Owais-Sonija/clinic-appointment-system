import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { BsFileEarmarkMedical, BsClockHistory, BsPlusCircle, BsFilter, BsCapsule, BsEyeglasses } from 'react-icons/bs';

const fetchRecords = async (patientId?: string) => {
    const url = patientId ? `/api/emr/patient/${patientId}` : '/api/emr/patient';
    const res = await axiosInstance.get(url);
    return res.data?.data || [];
};

const MedicalRecords = () => {
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const { data: records = [], isLoading } = useQuery({
        queryKey: ['emr-records', selectedPatient],
        queryFn: () => fetchRecords(selectedPatient || undefined)
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Electronic Medical Records</h2>
                    <p className="text-gray-500 font-medium">A unified timeline of patient clinical history and prescriptions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all">
                        <BsPlusCircle className="text-xl" />
                        <span>New Clinical Note</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters / Search */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <BsFilter className="text-blue-600" /> Filters
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Range</label>
                                <select className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3">
                                    <option>All Time</option>
                                    <option>Last 30 Days</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Record Type</label>
                                <div className="mt-3 space-y-2">
                                    {['All Records', 'Consultations', 'Lab Reports', 'Prescriptions'].map(type => (
                                        <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition">
                                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" defaultChecked={type === 'All Records'} />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-3 space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
                            <BsClockHistory className="text-6xl text-gray-100 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No clinical history found</h3>
                            <p className="text-gray-400 mt-2">Start by recording a clinical note or prescription during an appointment.</p>
                        </div>
                    ) : (
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-indigo-500/50 before:to-emerald-500/50">
                            {records.map((record: any, idx: number) => (
                                <div key={record._id} className="relative group">
                                    <div className="absolute -left-10 top-2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                                        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {record.type === 'Prescription' ? <BsCapsule /> : <BsFileEarmarkMedical />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{record.diagnosis || 'Clinical Update'}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">{new Date(record.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-full tracking-wider border border-gray-100">
                                                    Dr. {record.doctorId?.userId?.name || 'Staff'}
                                                </span>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                                                    <BsEyeglasses className="text-xl" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-50">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Symptom Summary</p>
                                                <p className="text-sm text-gray-700 leading-relaxed italic">"{record.symptoms || 'No specific symptoms recorded.'}"</p>
                                            </div>
                                            {record.prescriptions?.length > 0 && (
                                                <div className="bg-emerald-50/30 rounded-2xl p-4 border border-emerald-50/50">
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2 tracking-widest">Prescription</p>
                                                    <ul className="space-y-2">
                                                        {record.prescriptions.map((p: any, i: number) => (
                                                            <li key={i} className="text-xs font-bold text-gray-800 flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                                {p.medicineName} — <span className="text-emerald-600 font-medium">{p.dosage}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalRecords;
