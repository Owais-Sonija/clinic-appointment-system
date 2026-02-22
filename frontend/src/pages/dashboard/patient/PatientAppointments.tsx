import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaTimesCircle, FaCheckCircle, FaSpinner, FaUserMd } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const PatientAppointments = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const fetchAppointments = async () => (await axiosInstance.get('/api/appointments')).data?.data || [];
    const { data: appointments = [], isLoading } = useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.delete(`/api/appointments/${id}`),
        onSuccess: () => {
            toast.success('Appointment cancelled successfully');
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['patient-summary'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    });

    const handleCancelAppointment = (id: string) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        cancelMutation.mutate(id);
    };

    const upcomingAppts = appointments.filter((a: any) => a.status === 'pending' || a.status === 'confirmed');
    const pastAppts = appointments.filter((a: any) => a.status === 'completed' || a.status === 'cancelled');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-max"><FaCheckCircle /> Confirmed</span>;
            case 'pending': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-max"><FaSpinner className="animate-spin" /> Pending</span>;
            case 'cancelled': return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-max"><FaTimesCircle /> Cancelled</span>;
            case 'completed': return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-max"><FaCheckCircle /> Completed</span>;
            default: return status;
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 border-none pb-0">My Appointments</h1>
                    <p className="text-gray-500 mt-1">Manage your upcoming visits and view history.</p>
                </div>
                <button onClick={() => navigate('/patient/book-appointment')} className="btn-primary flex items-center gap-2">
                    <FaCalendarAlt /> Book New Appointment
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'upcoming' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Upcoming Visits ({upcomingAppts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'past' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Visit History ({pastAppts.length})
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {activeTab === 'upcoming' && (
                        <div className="animate-fade-in">
                            {upcomingAppts.length === 0 ? (
                                <EmptyState
                                    title="No upcoming visits"
                                    description="You don't have any appointments scheduled right now. Ready for a checkup?"
                                    icon="📅"
                                    action={{ label: 'Book New Visit', onClick: () => navigate('/patient/book-appointment') }}
                                />
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {upcomingAppts.map((appt: any) => (
                                        <div key={appt._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-gray-50/50 relative overflow-hidden flex flex-col">
                                            <div className="absolute top-0 right-0 p-4">{getStatusBadge(appt.status)}</div>
                                            <div className="flex items-center gap-4 mb-4 mt-2">
                                                <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-primary text-2xl border">
                                                    <FaUserMd />
                                                </div>
                                                <div className="pr-20">
                                                    <h4 className="font-bold text-gray-900 text-lg">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</h4>
                                                    <p className="text-sm text-gray-500">{appt.serviceId?.name || appt.doctorId?.specialization || 'General Consultation'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-gray-100 mb-5 flex justify-between mt-auto shadow-sm">
                                                <div>
                                                    <p className="text-gray-400 font-semibold text-xs tracking-wider uppercase mb-1">Date</p>
                                                    <p className="font-bold text-gray-800">{new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-gray-400 font-semibold text-xs tracking-wider uppercase mb-1">Time</p>
                                                    <p className="font-bold text-gray-800">{appt.startTime}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCancelAppointment(appt._id)}
                                                disabled={cancelMutation.isPending}
                                                className="w-full py-3 border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 font-bold transition flex-shrink-0 mt-auto shadow-sm disabled:opacity-50"
                                            >
                                                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'past' && (
                        <div className="animate-fade-in">
                            {pastAppts.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-4 border border-gray-100 shadow-sm">🕰️</div>
                                    <h3 className="text-xl font-bold text-gray-900">No Past History</h3>
                                    <p className="text-gray-500 mt-2">You don't have any past or cancelled appointments.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Doctor / Service</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Date & Time</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {pastAppts.map((appt: any) => (
                                                <tr key={appt._id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-gray-900">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500">{appt.serviceId?.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        <div className="font-semibold">{new Date(appt.date).toLocaleDateString()}</div>
                                                        <div className="text-xs">{appt.startTime}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(appt.status)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments;

