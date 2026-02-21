import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaTimesCircle, FaCheckCircle, FaSpinner, FaUserMd } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext)!;
    const location = useLocation();
    const preselectDoctor = location.state?.preselectDoctor || '';

    const [activeTab, setActiveTab] = useState('upcoming');
    const queryClient = useQueryClient();

    const fetchAppointments = async () => (await axiosInstance.get('/api/appointments')).data?.data || [];
    const fetchDoctors = async () => (await axiosInstance.get('/api/doctors')).data?.data || [];
    const fetchServices = async () => (await axiosInstance.get('/api/clinic/services')).data?.data || [];

    const { data: appointments = [], isLoading: apptsLoading } = useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments });
    const { data: doctors = [], isLoading: docsLoading } = useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors });
    const { data: services = [], isLoading: servsLoading } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

    const loading = apptsLoading || docsLoading || servsLoading;

    const [bookingData, setBookingData] = useState({
        doctorId: preselectDoctor,
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
    });

    // Auto-navigate to book if no appointments
    useEffect(() => {
        if (!loading && appointments.length === 0 && preselectDoctor) {
            setActiveTab('book');
        }
    }, [loading, appointments.length, preselectDoctor]);

    const handleBookingChange = (e: any) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

    const bookMutation = useMutation({
        mutationFn: (newBooking: any) => axiosInstance.post('/api/appointments', newBooking),
        onSuccess: () => {
            toast.success('Appointment booked successfully!');
            setBookingData({ doctorId: '', serviceId: '', appointmentDate: '', appointmentTime: '', notes: '' });
            setActiveTab('upcoming');
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to book appointment.');
        }
    });

    const handleBookingSubmit = (e: any) => {
        e.preventDefault();
        // Transform form data if needed by schema (converting appointmentDate -> date, appointmentTime -> startTime)
        // Auto-calculate endTime as startTime + 30 minutes
        const [h, m] = bookingData.appointmentTime.split(':').map(Number);
        const endDate = new Date(0, 0, 0, h, m + 30);
        const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        const payload = {
            doctorId: bookingData.doctorId,
            serviceId: bookingData.serviceId,
            date: bookingData.appointmentDate,
            startTime: bookingData.appointmentTime,
            endTime,
            notes: bookingData.notes
        };
        bookMutation.mutate(payload);
    };

    const cancelMutation = useMutation({
        mutationFn: (id: string) => axiosInstance.delete(`/api/appointments/${id}`),
        onSuccess: () => {
            toast.success('Appointment cancelled successfully');
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
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

    if (loading) return <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-primary text-white">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name.split(' ')[0]}!</h1>
                        <p className="opacity-90">Manage your appointments and health records all in one place.</p>
                    </div>
                    <div className="mt-4 md:mt-0 bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 hidden md:block">
                        <div className="text-sm uppercase tracking-wide opacity-90 font-semibold mb-1">Upcoming Visits</div>
                        <div className="text-3xl font-bold">{upcomingAppts.length}</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <p className="text-sm font-semibold text-gray-400 pl-2 uppercase tracking-wide">Dashboard</p>
                            </div>
                            <ul className="p-2 space-y-1">
                                <li>
                                    <button onClick={() => setActiveTab('upcoming')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === 'upcoming' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        Active Appointments
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('past')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === 'past' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        History & Records
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('book')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === 'book' ? 'bg-primary text-white shadow-md shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        Book New Visit
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

                        {activeTab === 'upcoming' && (
                            <div>
                                <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2 border-b pb-4"><FaCalendarAlt className="text-primary" /> Upcoming Appointments</h2>
                                {upcomingAppts.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-3xl">📅</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">No upcoming visits</h3>
                                        <p className="text-gray-500 mb-6">You don't have any appointments scheduled right now.</p>
                                        <button onClick={() => setActiveTab('book')} className="btn-primary">Book an Appointment</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {upcomingAppts.map((appt: any) => (
                                            <div key={appt._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-gray-50/50 relative overflow-hidden flex flex-col">
                                                <div className="absolute top-0 right-0 p-4">{getStatusBadge(appt.status)}</div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-primary text-xl border">
                                                        <FaUserMd />
                                                    </div>
                                                    <div className="pr-20">
                                                        <h4 className="font-bold text-dark truncate">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</h4>
                                                        <p className="text-sm text-gray-500 truncate">{appt.serviceId?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded-lg border border-gray-100 mb-4 text-sm flex justify-between mt-auto">
                                                    <div>
                                                        <p className="text-gray-500 font-medium">Date</p>
                                                        <p className="font-bold">{new Date(appt.appointmentDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-500 font-medium">Time</p>
                                                        <p className="font-bold">{appt.appointmentTime}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleCancelAppointment(appt._id)} className="w-full py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition text-sm flex-shrink-0 mt-auto">
                                                    Cancel Appointment
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'past' && (
                            <div>
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Appointment History</h2>
                                {pastAppts.length === 0 ? (
                                    <p className="text-center py-12 text-gray-500 text-lg">No past appointments found.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Doctor</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Service</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Date & Time</th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {pastAppts.map((appt: any) => (
                                                    <tr key={appt._id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{appt.serviceId?.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.appointmentTime}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(appt.status)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'book' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Book New Appointment</h2>
                                <form onSubmit={handleBookingSubmit} className="max-w-xl bg-gray-50/50 p-6 rounded-2xl border border-gray-100 placeholder-shown:opacity-100">
                                    <div className="space-y-5">
                                        <div>
                                            <label className="label-text">Select Speciality / Service</label>
                                            <select name="serviceId" required value={bookingData.serviceId} onChange={handleBookingChange} className="input-field bg-white">
                                                <option value="">-- Choose a Service --</option>
                                                {services.map((s: any) => <option key={s._id} value={s._id}>{s.name} (${s.price})</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="label-text">Select Doctor</label>
                                            <select name="doctorId" required value={bookingData.doctorId} onChange={handleBookingChange} className="input-field bg-white">
                                                <option value="">-- Choose a Doctor --</option>
                                                {doctors.map((d: any) => <option key={d._id} value={d._id}>Dr. {d.userId?.name} - {d.specialization}</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label-text">Preferred Date</label>
                                                <input type="date" name="appointmentDate" required min={new Date().toISOString().split('T')[0]} value={bookingData.appointmentDate} onChange={handleBookingChange} className="input-field bg-white" />
                                            </div>
                                            <div>
                                                <label className="label-text">Preferred Time</label>
                                                <input type="time" name="appointmentTime" required value={bookingData.appointmentTime} onChange={handleBookingChange} className="input-field bg-white" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="label-text">Additional Notes (Optional)</label>
                                            <textarea name="notes" rows={3} value={bookingData.notes} onChange={handleBookingChange} className="input-field bg-white resize-none" placeholder="Briefly describe your symptoms..."></textarea>
                                        </div>

                                        <div className="pt-4">
                                            <button type="submit" disabled={bookMutation.isPending} className="btn-primary w-full py-3 hover:shadow-lg transition">
                                                {bookMutation.isPending ? 'Processing...' : 'Confirm Appointment'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
