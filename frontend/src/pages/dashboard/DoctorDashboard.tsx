import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserMd, FaCalendarCheck, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext)!;
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/appointments');
            // Filter for this specific doctor if the API returns all
            // Or handled securely via backend mapping
            const allAppts = res.data?.data || [];
            const myAppts = allAppts.filter((a: any) => a.doctorId?.userId?._id === user?._id || a.doctorId?.userId === user?._id);
            setAppointments(myAppts.length > 0 ? myAppts : allAppts); // Fallback for demo
        } catch (error: any) {
            console.error("Error fetching appointments", error);
            toast.error('Failed to load appointments. Are you an Admin?');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await axiosInstance.put(`/api/appointments/${id}/status`, { status });
            toast.success(`Appointment marked as ${status}`);
            fetchAppointments();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dark mb-2">Doctor Portal</h1>
                        <p className="text-gray-600 font-medium">Welcome back, Dr. {user?.name.split(' ')[0]}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="bg-blue-50 text-primary p-4 rounded-xl text-center min-w-[120px]">
                            <h3 className="text-2xl font-bold">{appointments.filter(a => a.status === 'pending').length}</h3>
                            <p className="text-sm font-semibold uppercase tracking-wider">Pending</p>
                        </div>
                        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center min-w-[120px]">
                            <h3 className="text-2xl font-bold">{appointments.filter(a => a.status === 'confirmed').length}</h3>
                            <p className="text-sm font-semibold uppercase tracking-wider">Confirmed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4 flex items-center gap-2"><FaCalendarCheck className="text-primary" /> Active Appointments</h2>

                    {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length === 0 ? (
                        <p className="text-center py-12 text-gray-500 text-lg">No active appointments scheduled.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').map(appt => (
                                <div key={appt._id} className={`border rounded-xl p-5 relative overflow-hidden flex flex-col ${appt.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' : 'border-green-200 bg-green-50/30'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-dark text-lg">{appt.patientId?.name || 'Unknown Patient'}</h4>
                                            <p className="text-sm text-gray-500">{appt.serviceId?.name}</p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border border-gray-100 mb-6 text-sm flex justify-between mt-auto">
                                        <div>
                                            <p className="text-gray-500 font-medium whitespace-nowrap"><FaClock className="inline mr-1" /> Date & Time</p>
                                            <p className="font-bold">{new Date(appt.appointmentDate).toLocaleDateString()} at {appt.appointmentTime}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {appt.status === 'pending' && (
                                            <button onClick={() => handleUpdateStatus(appt._id, 'confirmed')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1">
                                                <FaCheck /> Confirm
                                            </button>
                                        )}
                                        {appt.status === 'confirmed' && (
                                            <button onClick={() => handleUpdateStatus(appt._id, 'completed')} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1">
                                                <FaCheck /> Complete
                                            </button>
                                        )}
                                        <button onClick={() => handleUpdateStatus(appt._id, 'cancelled')} className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1">
                                            <FaTimes /> Cancel
                                        </button>
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

export default DoctorDashboard;
