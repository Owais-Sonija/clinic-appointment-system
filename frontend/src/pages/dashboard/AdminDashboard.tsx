import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import DataTable from 'react-data-table-component';
import { FaUserMd, FaUsers, FaUserNurse, FaBoxOpen, FaTachometerAlt, FaCalendarAlt } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const fetchPatients = async () => (await axiosInstance.get('/api/users?role=patient')).data?.data || [];
const fetchDoctors = async () => (await axiosInstance.get('/api/doctors')).data?.data || [];
const fetchStaff = async () => (await axiosInstance.get('/api/staff')).data?.data || [];
const fetchInventory = async () => (await axiosInstance.get('/api/inventory')).data?.data || [];
const fetchAppointments = async () => (await axiosInstance.get('/api/appointments')).data?.data || [];

const AdminDashboard = () => {
    const { user } = useContext(AuthContext)!;
    const [activeTab, setActiveTab] = useState('overview');
    const [simulatedLoading, setSimulatedLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setSimulatedLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const { data: patients, isLoading: loadP } = useQuery({ queryKey: ['admin-patients'], queryFn: fetchPatients, enabled: activeTab === 'patients' || activeTab === 'overview' });
    const { data: doctors, isLoading: loadD } = useQuery({ queryKey: ['admin-doctors'], queryFn: fetchDoctors, enabled: activeTab === 'doctors' });
    const { data: staff, isLoading: loadS } = useQuery({ queryKey: ['admin-staff'], queryFn: fetchStaff, enabled: activeTab === 'staff' });
    const { data: inventory, isLoading: loadI } = useQuery({ queryKey: ['admin-inventory'], queryFn: fetchInventory, enabled: activeTab === 'inventory' || activeTab === 'overview' });
    const { data: appointments = [], isLoading: loadA } = useQuery({ queryKey: ['admin-appointments'], queryFn: fetchAppointments, enabled: activeTab === 'appointments' || activeTab === 'overview' });

    const isLoading = simulatedLoading || (activeTab === 'overview' && (loadP || loadI || loadA));

    const patientCols = [
        { name: 'Name', selector: (row: any) => row.name, sortable: true },
        { name: 'Email', selector: (row: any) => row.email, sortable: true },
        { name: 'Phone', selector: (row: any) => row.phone || 'N/A' },
        { name: 'Joined', selector: (row: any) => new Date(row.createdAt).toLocaleDateString(), sortable: true }
    ];

    const doctorCols = [
        { name: 'Name', selector: (row: any) => 'Dr. ' + (row.userId?.name || 'Unknown'), sortable: true },
        { name: 'Specialization', selector: (row: any) => row.specialization, sortable: true },
        { name: 'Fee', selector: (row: any) => `$${row.consultationFee}`, sortable: true },
        { name: 'Exp (Years)', selector: (row: any) => row.experience, sortable: true }
    ];

    const calendarEvents = appointments
        .filter((a: any) => a.status === 'Scheduled' || a.status === 'Completed')
        .map((a: any) => {
            const startStr = `${a.date?.split('T')[0]}T${a.startTime}`;
            const endStr = `${a.date?.split('T')[0]}T${a.endTime}`;
            return {
                title: `${a.patientId?.name || 'Patient'} w/ Dr. ${a.doctorId?.userId?.name || 'Doctor'}`,
                start: new Date(startStr),
                end: new Date(endStr),
                resource: a
            };
        });

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary rounded-2xl shadow-sm p-6 md:p-8 mb-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
                    <p className="opacity-90">Welcome, {user?.name}</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-64 flex-shrink-0">
                        <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 p-2 space-y-1 tour-admin-nav">
                            <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}><FaTachometerAlt /> Overview</button>
                            <button onClick={() => setActiveTab('patients')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'patients' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}><FaUsers /> Patients</button>
                            <button onClick={() => setActiveTab('doctors')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'doctors' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}><FaUserMd /> Doctors</button>
                            <button onClick={() => setActiveTab('appointments')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'appointments' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}><FaCalendarAlt /> Schedule</button>
                        </nav>
                    </div>

                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {activeTab === 'overview' && (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 tour-stats-grid">
                                            <div className="bg-blue-600 rounded-2xl p-6 text-white"><p className="text-xs uppercase font-bold opacity-80">Patients</p><h3 className="text-4xl font-black mt-2">{patients?.length || 0}</h3></div>
                                            <div className="bg-indigo-600 rounded-2xl p-6 text-white"><p className="text-xs uppercase font-bold opacity-80">Revenue</p><h3 className="text-4xl font-black mt-2">$24,850</h3></div>
                                            <div className="bg-emerald-600 rounded-2xl p-6 text-white"><p className="text-xs uppercase font-bold opacity-80">Appts</p><h3 className="text-4xl font-black mt-2">{appointments?.length || 0}</h3></div>
                                            <div className="bg-amber-600 rounded-2xl p-6 text-white"><p className="text-xs uppercase font-bold opacity-80">Low Stock</p><h3 className="text-4xl font-black mt-2">{inventory?.filter((i: any) => i.stockQuantity <= i.reorderLevel).length || 0}</h3></div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64"><h4 className="font-bold mb-4">Revenue Stream</h4><Bar data={{ labels: ['J', 'F', 'M', 'A', 'M', 'J'], datasets: [{ label: 'Revenue', data: [400, 500, 450, 600, 550, 700], backgroundColor: '#3b82f6' }] }} options={{ maintainAspectRatio: false }} /></div>
                                    </div>
                                )}
                                {activeTab === 'patients' && <DataTable columns={patientCols} data={patients || []} pagination highlightOnHover />}
                                {activeTab === 'doctors' && <DataTable columns={doctorCols} data={doctors || []} pagination highlightOnHover />}
                                {activeTab === 'appointments' && (
                                    <div className="h-[500px]">
                                        <Calendar localizer={localizer} events={calendarEvents} startAccessor="start" endAccessor="end" style={{ height: '100%' }} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
