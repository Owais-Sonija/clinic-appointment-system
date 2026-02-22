import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { BsPlus, BsGrid3X2GapFill, BsListUl, BsFilter } from 'react-icons/bs';
import { toast } from 'react-toastify';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const fetchAppointments = async () => (await axiosInstance.get('/api/appointments')).data?.data || [];
const fetchDoctors = async () => (await axiosInstance.get('/api/doctors')).data?.data || [];
const fetchServices = async () => (await axiosInstance.get('/api/clinic/services')).data?.data || [];

const Appointments = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<'calendar' | 'list'>('calendar');

    const { data: appointments = [], isLoading } = useQuery({ queryKey: ['all-appointments'], queryFn: fetchAppointments });
    const { data: doctors = [] } = useQuery({ queryKey: ['doctors-list'], queryFn: fetchDoctors });
    const { data: services = [] } = useQuery({ queryKey: ['services-list'], queryFn: fetchServices });

    const calendarEvents = appointments.map((a: any) => {
        const datePart = a.date?.split('T')[0] || a.appointmentDate?.split('T')[0];
        const startStr = `${datePart}T${a.startTime || a.appointmentTime}`;
        const endStr = `${datePart}T${a.endTime || '10:00'}`;
        return {
            title: `${a.patientId?.name || 'Patient'} w/ Dr. ${a.doctorId?.userId?.name || 'Doctor'}`,
            start: new Date(startStr),
            end: new Date(endStr),
            resource: a
        };
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Master Schedule</h2>
                    <p className="text-gray-500 font-medium">Manage all clinic appointments and doctor availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex">
                        <button
                            onClick={() => setView('calendar')}
                            className={`p-2 rounded-xl transition-all ${view === 'calendar' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}
                        >
                            <BsGrid3X2GapFill className="text-xl" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'}`}
                        >
                            <BsListUl className="text-xl" />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-105">
                        <BsPlus className="text-2xl" />
                        <span>Book Appointment</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-blue-50/50 border border-gray-100">
                {isLoading ? (
                    <div className="flex justify-center items-center h-[600px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : view === 'calendar' ? (
                    <div className="h-[700px] chart-container">
                        <Calendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            eventPropGetter={(event: any) => {
                                let bg = '#3b82f6'; // Scheduled
                                if (event.resource.status === 'Completed') bg = '#10b981';
                                if (event.resource.status === 'Cancelled') bg = '#ef4444';
                                return { style: { backgroundColor: bg, border: 'none', borderRadius: '8px', padding: '4px 8px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' } };
                            }}
                        />
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <BsFilter className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">List view implementation in progress...</h3>
                        <p className="text-gray-400">Use calendar view for full functionality.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
