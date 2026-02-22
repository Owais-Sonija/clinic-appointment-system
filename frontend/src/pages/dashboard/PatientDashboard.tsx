import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaTimesCircle, FaCheckCircle, FaSpinner, FaUserMd, FaArrowRight, FaCalendarPlus } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const PatientDashboard = () => {
    const { user } = useContext(AuthContext)!;
    const location = useLocation();
    const preselectDoctor = location.state?.preselectDoctor || '';

    const [activeTab, setActiveTab] = useState('upcoming');
    const [bookingStep, setBookingStep] = useState(1);
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
            setBookingStep(1);
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

    if (loading) return <LoadingSpinner />;

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
                                    <button onClick={() => setActiveTab('upcoming')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition tour-active-tab ${activeTab === 'upcoming' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        Active Appointments
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('past')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition tour-past-tab ${activeTab === 'past' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
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
                                    <EmptyState
                                        title="No upcoming visits"
                                        description="You don't have any appointments scheduled right now. Ready for a checkup?"
                                        icon="📅"
                                        action={{ label: 'Book New Visit', onClick: () => setActiveTab('book') }}
                                    />
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

                                {/* Step Indicator */}
                                <div className="flex items-center justify-between mb-10 max-w-xl mx-auto px-4">
                                    {[1, 2, 3].map((s) => (
                                        <div key={s} className="flex flex-col items-center flex-1 relative">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-2 z-10 ${bookingStep >= s ? 'bg-primary border-primary text-white shadow-lg shadow-blue-500/30' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                {s}
                                            </div>
                                            <span className={`text-xs mt-2 font-semibold uppercase tracking-wider ${bookingStep >= s ? 'text-primary' : 'text-gray-400'}`}>
                                                {s === 1 ? 'Doctor' : s === 2 ? 'Schedule' : 'Review'}
                                            </span>
                                            {s < 3 && <div className={`absolute left-1/2 top-5 w-full h-0.5 -z-0 ${bookingStep > s ? 'bg-primary' : 'bg-gray-100'}`}></div>}
                                        </div>
                                    ))}
                                </div>

                                <div className="max-w-xl mx-auto">
                                    {bookingStep === 1 && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
                                                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2"><FaUserMd /> Select Provider & Service</h3>
                                                <div className="space-y-5">
                                                    <div>
                                                        <label className="label-text text-blue-900/70">Medical Service</label>
                                                        <select name="serviceId" required value={bookingData.serviceId} onChange={handleBookingChange} className="input-field bg-white border-blue-100 focus:border-primary">
                                                            <option value="">-- Choose a Service --</option>
                                                            {services.map((s: any) => <option key={s._id} value={s._id}>{s.name} (${s.price})</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="label-text text-blue-900/70">Healthcare Professional</label>
                                                        <select name="doctorId" required value={bookingData.doctorId} onChange={handleBookingChange} className="input-field bg-white border-blue-100 focus:border-primary">
                                                            <option value="">-- Choose a Doctor --</option>
                                                            {doctors.map((d: any) => <option key={d._id} value={d._id}>Dr. {d.userId?.name} - {d.specialization}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                disabled={!bookingData.doctorId || !bookingData.serviceId}
                                                onClick={() => setBookingStep(2)}
                                                className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                                            >
                                                Next: Choose Schedule <FaArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    )}

                                    {bookingStep === 2 && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-8">
                                                <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">📅 Select Date & Time</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="label-text text-emerald-900/70">Preferred Date</label>
                                                        <input type="date" name="appointmentDate" required min={new Date().toISOString().split('T')[0]} value={bookingData.appointmentDate} onChange={handleBookingChange} className="input-field bg-white border-emerald-100 focus:border-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <label className="label-text text-emerald-900/70">Preferred Time</label>
                                                        <input type="time" name="appointmentTime" required value={bookingData.appointmentTime} onChange={handleBookingChange} className="input-field bg-white border-emerald-100 focus:border-emerald-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setBookingStep(1)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">Back</button>
                                                <button
                                                    disabled={!bookingData.appointmentDate || !bookingData.appointmentTime}
                                                    onClick={() => setBookingStep(3)}
                                                    className="flex-[2] btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next: Review Details
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {bookingStep === 3 && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                                                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Final Confirmation</h3>
                                                <div className="space-y-4 mb-6">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Professional:</span>
                                                        <span className="font-bold">Dr. {doctors.find((d: any) => d._id === bookingData.doctorId)?.userId?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Service:</span>
                                                        <span className="font-bold">{services.find((s: any) => s._id === bookingData.serviceId)?.name}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Schedule:</span>
                                                        <span className="font-bold text-primary">{new Date(bookingData.appointmentDate).toLocaleDateString()} at {bookingData.appointmentTime}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="label-text">Additional Notes (Symptoms, Allergies, etc.)</label>
                                                    <textarea name="notes" rows={3} value={bookingData.notes} onChange={handleBookingChange} className="input-field bg-white resize-none" placeholder="Provide any context for the doctor..."></textarea>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setBookingStep(2)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">Back</button>
                                                <button
                                                    onClick={handleBookingSubmit}
                                                    disabled={bookMutation.isPending}
                                                    className="flex-[2] btn-primary py-4 text-lg shadow-xl shadow-blue-500/20"
                                                >
                                                    {bookMutation.isPending ? 'Confirming Appointment...' : 'Confirm & Book Visit'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
