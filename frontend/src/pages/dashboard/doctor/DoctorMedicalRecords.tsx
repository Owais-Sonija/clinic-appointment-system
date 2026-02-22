import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { FaSearch, FaFilter, FaFileAlt, FaEye, FaDownload } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { Link } from 'react-router-dom';

const DoctorMedicalRecords = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: records, isLoading } = useQuery({
        queryKey: ['doctor-medical-records'],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/emr');
            return res.data.data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    // Filter by patient name (frontend search since API is generic)
    const filteredRecords = records?.filter((record: any) =>
        record.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-500 font-medium">Access and manage patient clinical history</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by patient or diagnosis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all w-80"
                        />
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Visit Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Prescription</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRecords?.length > 0 ? filteredRecords.map((record: any) => (
                                <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                {record.patientId?.name?.[0].toUpperCase()}
                                            </div>
                                            <p className="font-bold text-gray-900">{record.patientId?.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900">{new Date(record.visitDate || record.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]">{record.diagnosis}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                            {record.prescriptions?.length || 0} Medicines
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                                                <FaDownload />
                                            </button>
                                            <Link
                                                to={`/medical-records/${record._id}`}
                                                className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No medical records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorMedicalRecords;
