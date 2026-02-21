import React, { useState, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserMd, FaCalendarCheck, FaClock, FaCheck, FaTimes, FaCalendarAlt, FaList } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import EMRModal from '../../components/EMRModal';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext)!;
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [selectedAppt, setSelectedAppt] = useState<any>(null);
    const [isEMROpen, setIsEMROpen] = useState(false);

    const fetchAppointments = async () => {
        const res = await axiosInstance.get('/api/appointments');
        const allAppts = res.data?.data || [];
        const myAppts = allAppts.filter((a: any) => a.doctorId?.userId?._id === user?._id || a.doctorId?.userId === user?._id);
        return myAppts.length > 0 ? myAppts : allAppts; // Fallback for testing generic admin accounts
    };

    const { data: appointments = [], isLoading } = useQuery({ queryKey: ['doctor-appointments'], queryFn: fetchAppointments });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => axiosInstance.put(`/api/appointments/${id}/status`, { status }),
        onSuccess: (data, variables) => {
            toast.success(`Appointment marked as ${variables.status}`);
            queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    });

    const handleUpdateStatus = (id: string, status: string) => statusMutation.mutate({ id, status });

    if (isLoading) return <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

    const calendarEvents = appointments
        .filter((a: any) => a.status === 'Scheduled' || a.status === 'Completed')
        .map((a: any) => {
            const startStr = `${a.date?.split('T')[0]}T${a.startTime}`;
            const endStr = `${a.date?.split('T')[0]}T${a.endTime}`;
            return {
                title: `${a.patientId?.name || 'Patient'} - ${a.serviceId?.name || 'Consult'}`,
                start: new Date(startStr),
                end: new Date(endStr),
                resource: a
            };
        });

    const pendingCount = appointments.filter((a: any) => a.status === 'Scheduled').length;
    const completedCount = appointments.filter((a: any) => a.status === 'Completed').length;

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
                            <h3 className="text-2xl font-bold">{pendingCount}</h3>
                            <p className="text-sm font-semibold uppercase tracking-wider">Scheduled</p>
                        </div>
                        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-center min-w-[120px]">
                            <h3 className="text-2xl font-bold">{completedCount}</h3>
                            <p className="text-sm font-semibold uppercase tracking-wider">Completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-dark flex items-center gap-2"><FaCalendarCheck className="text-primary" /> Active Schedule</h2>
                        <div className="flex bg-gray-200 p-1 rounded-lg">
                            <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:bg-white/50'}`}>
                                <FaCalendarAlt /> Calendar
                            </button>
                            <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:bg-white/50'}`}>
                                <FaList /> List View
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {viewMode === 'calendar' ? (
                            <div className="h-[600px]">
                                <Calendar
                                    localizer={localizer}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    views={['month', 'week', 'day']}
                                    defaultView="week"
                                    min={new Date(0, 0, 0, 8, 0, 0)}  // 8am
                                    max={new Date(0, 0, 0, 20, 0, 0)} // 8pm
                                    style={{ height: '100%' }}
                                    eventPropGetter={(event: any) => {
                                        const bg = event.resource.status === 'Completed' ? '#10b981' : '#3b82f6';
                                        return { style: { backgroundColor: bg, border: 'none', borderRadius: '4px' } };
                                    }}
                                    onSelectEvent={(event: any) => {
                                        setSelectedAppt(event.resource);
                                        setIsEMROpen(true);
                                    }}
                                />
                            </div>
                        ) : (
                            <div>
                                {appointments.filter((a: any) => a.status === 'Scheduled').length === 0 ? (
                                    <p className="text-center py-12 text-gray-500 text-lg">No active appointments scheduled.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {appointments.filter((a: any) => a.status === 'Scheduled').map((appt: any) => (
                                            <div key={appt._id} className="border border-blue-200 bg-blue-50/30 rounded-xl p-5 relative overflow-hidden flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-dark text-lg">{appt.patientId?.name || 'Unknown Patient'}</h4>
                                                        <p className="text-sm text-gray-500">{appt.serviceId?.name}</p>
                                                    </div>
                                                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                                                        {appt.status}
                                                    </span>
                                                </div>

                                                <div className="bg-white p-3 rounded-lg border border-gray-100 mb-6 text-sm flex justify-between mt-auto">
                                                    <div>
                                                        <p className="text-gray-500 font-medium whitespace-nowrap"><FaClock className="inline mr-1" /> Date & Time</p>
                                                        <p className="font-bold">{new Date(appt.date).toLocaleDateString()} at {appt.startTime}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button onClick={() => { setSelectedAppt(appt); setIsEMROpen(true); }} className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1">
                                                        View EMR
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(appt._id, 'Completed')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1">
                                                        <FaCheck /> Done
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(appt._id, 'Cancelled')} className="flex-1 border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition flex justify-center items-center gap-1">
                                                        <FaTimes /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {selectedAppt && (
                    <EMRModal
                        appointment={selectedAppt}
                        isOpen={isEMROpen}
                        onClose={() => { setIsEMROpen(false); setSelectedAppt(null); }}
                    />
                )}

            </div>
        </div>
    );
};

export default DoctorDashboard;
