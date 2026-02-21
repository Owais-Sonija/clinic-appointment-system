import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import DataTable from 'react-data-table-component';
import { FaUserMd, FaUsers, FaUserNurse, FaBoxOpen, FaTachometerAlt, FaCalendarAlt } from 'react-icons/fa';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

    const { data: patients, isLoading: loadP } = useQuery({ queryKey: ['admin-patients'], queryFn: fetchPatients, enabled: activeTab === 'patients' });
    const { data: doctors, isLoading: loadD } = useQuery({ queryKey: ['admin-doctors'], queryFn: fetchDoctors, enabled: activeTab === 'doctors' });
    const { data: staff, isLoading: loadS } = useQuery({ queryKey: ['admin-staff'], queryFn: fetchStaff, enabled: activeTab === 'staff' });
    const { data: inventory, isLoading: loadI } = useQuery({ queryKey: ['admin-inventory'], queryFn: fetchInventory, enabled: activeTab === 'inventory' });
    const { data: appointments = [], isLoading: loadA } = useQuery({ queryKey: ['admin-appointments'], queryFn: fetchAppointments, enabled: activeTab === 'appointments' });

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

    const staffCols = [
        { name: 'Name', selector: (row: any) => row.userId?.name || 'Unknown', sortable: true },
        { name: 'Role', selector: (row: any) => row.userId?.role || 'staff', sortable: true },
        { name: 'Department', selector: (row: any) => row.department, sortable: true },
        { name: 'Designation', selector: (row: any) => row.designation, sortable: true },
        { name: 'Shift', selector: (row: any) => `${row.shiftStartTime} - ${row.shiftEndTime}` }
    ];

    const inventoryCols = [
        { name: 'Item Name', selector: (row: any) => row.itemName, sortable: true },
        { name: 'Category', selector: (row: any) => row.category, sortable: true },
        { name: 'Stock Quantity', selector: (row: any) => `${row.stockQuantity} ${row.unit}`, sortable: true },
        { name: 'Unit Price', selector: (row: any) => `$${row.unitPrice}`, sortable: true },
        { name: 'Status', selector: (row: any) => row.stockQuantity <= row.reorderLevel ? 'Low Stock' : 'In Stock', sortable: true }
    ];

    const calendarEvents = appointments
        .filter((a: any) => a.status === 'Scheduled' || a.status === 'Completed')
        .map((a: any) => {
            const startStr = `${a.date?.split('T')[0]}T${a.startTime}`;
            const endStr = `${a.date?.split('T')[0]}T${a.endTime}`;
            return {
                title: `${a.patientId?.name || 'Patient'} w/ Dr. ${a.doctorId?.userId?.name || 'Doctor'} - ${a.serviceId?.name || 'Consult'}`,
                start: new Date(startStr),
                end: new Date(endStr),
                resource: a
            };
        });

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-primary text-white">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
                        <p className="opacity-90">Welcome, Super Admin {user?.name}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <p className="text-sm font-semibold text-gray-400 pl-2 uppercase tracking-wide">Management</p>
                            </div>
                            <ul className="p-2 space-y-1">
                                <li>
                                    <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FaTachometerAlt /> Overview
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('patients')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'patients' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FaUsers /> Patients
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('doctors')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'doctors' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FaUserMd /> Doctors
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('staff')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'staff' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FaUserNurse /> Staff
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('inventory')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'inventory' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FaBoxOpen /> Inventory
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setActiveTab('appointments')} className={`w-full text-left px-4 py-3 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'appointments' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                                        <FaCalendarAlt /> Master Schedule
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 overflow-hidden">

                        {activeTab === 'overview' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">System Overview</h2>
                                <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed">
                                    Select a category from the sidebar to manage database records. Data tables support sorting and pagination natively.
                                </p>
                            </div>
                        )}

                        {activeTab === 'patients' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Patient Directory</h2>
                                <DataTable
                                    columns={patientCols}
                                    data={patients || []}
                                    progressPending={loadP}
                                    pagination
                                    highlightOnHover
                                    responsive
                                    customStyles={{ headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold' } } }}
                                />
                            </div>
                        )}

                        {activeTab === 'doctors' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Doctor Registry</h2>
                                <DataTable
                                    columns={doctorCols}
                                    data={doctors || []}
                                    progressPending={loadD}
                                    pagination
                                    highlightOnHover
                                    responsive
                                    customStyles={{ headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold' } } }}
                                />
                            </div>
                        )}

                        {activeTab === 'staff' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Clinic Staff</h2>
                                <DataTable
                                    columns={staffCols}
                                    data={staff || []}
                                    progressPending={loadS}
                                    pagination
                                    highlightOnHover
                                    responsive
                                    customStyles={{ headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold' } } }}
                                />
                            </div>
                        )}

                        {activeTab === 'inventory' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Inventory Management</h2>
                                <DataTable
                                    columns={inventoryCols}
                                    data={inventory || []}
                                    progressPending={loadI}
                                    pagination
                                    highlightOnHover
                                    responsive
                                    customStyles={{ headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold' } } }}
                                />
                            </div>
                        )}

                        {activeTab === 'appointments' && (
                            <div className="animate-fade-in h-full">
                                <h2 className="text-2xl font-bold text-dark mb-6 border-b pb-4">Clinic Master Schedule</h2>
                                {loadA ? (
                                    <div className="flex justify-center items-center py-32"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
                                ) : (
                                    <div className="h-[650px]">
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
                                            eventPropGetter={(event) => {
                                                const bg = event.resource.status === 'Completed' ? '#10b981' : '#3b82f6';
                                                return { style: { backgroundColor: bg, border: 'none', borderRadius: '4px' } };
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
