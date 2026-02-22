import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaEye, FaPlusCircle } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { Link } from 'react-router-dom';

const DoctorAppointments = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState({ status: '', date: '' });

    const { data: appointments, isLoading } = useQuery({
        queryKey: ['doctor-appointments', filter],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/doctor/appointments', { params: filter });
            return res.data.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            axiosInstance.put(`/api/appointments/${id}/status`, { status }),
        onSuccess: () => {
            toast.success('Appointment status updated');
            queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-500 font-medium">Manage your schedule and patient visits</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patient..."
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all w-64"
                        />
                    </div>
                    <div className="flex bg-white border border-gray-200 rounded-xl p-1">
                        <input
                            type="date"
                            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                            className="px-3 py-1 text-sm border-none focus:ring-0 outline-none text-gray-600 font-medium"
                        />
                        <select
                            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                            className="px-3 py-1 text-sm border-none border-l border-gray-100 focus:ring-0 outline-none text-gray-600 font-bold"
                        >
                            <option value="">All Statuses</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {appointments?.length > 0 ? appointments.map((appt: any) => (
                                <tr key={appt._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {appt.patientId?.name?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{appt.patientId?.name}</p>
                                                <p className="text-xs text-gray-500">{appt.patientId?.phone || 'No phone'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-gray-900">{new Date(appt.date).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-500 font-medium">{appt.startTime} - {appt.endTime}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                                            {appt.serviceId?.name || appt.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                                appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {appt.status === 'Scheduled' && (
                                                <>
                                                    <Link
                                                        to={`/medical-records/new/${appt._id}`}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Add Medical Record"
                                                    >
                                                        <FaPlusCircle />
                                                    </Link>
                                                    <button
                                                        onClick={() => statusMutation.mutate({ id: appt._id, status: 'Cancelled' })}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Cancel Appointment"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            <Link
                                                to={`/appointments/${appt._id}`}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No appointments found matching your filters.
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

export default DoctorAppointments;
