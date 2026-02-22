import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FaCalendarAlt, FaUserMd, FaArrowRight, FaCalendarPlus, FaFileMedical } from 'react-icons/fa';

const PatientOverview = () => {
    const { user } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const { data: summary, isLoading } = useQuery({
        queryKey: ['patient-summary'],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/patient/dashboard-summary');
            return res.data.data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Action Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-primary text-white">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name?.split(' ')[0] || 'Patient'}!</h1>
                    <p className="opacity-90">Manage your appointments and health records all in one place.</p>
                </div>
                <div className="mt-6 md:mt-0 flex gap-4">
                    <button onClick={() => navigate('/patient/book-appointment')} className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg flex items-center gap-2">
                        <FaCalendarPlus /> Book New Visit
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Upcoming Visits</p>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2">{summary?.upcomingCount || 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FaCalendarAlt className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Historical Visits</p>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2">{summary?.pastAppointmentsCount || 0}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FaUserMd className="text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Scripts</p>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2">{summary?.activePrescriptionsCount || 0}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <span className="text-xl">💊</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition cursor-pointer" onClick={() => navigate('/patient/medical-records')}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Health Records</p>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2">{summary?.recentMedicalRecords?.length || 0}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition">
                            <FaFileMedical className="text-xl" />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-orange-600 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        View Records <FaArrowRight />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Upcoming Appointments Summary Widget */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" /> Upcoming Schedule
                        </h2>
                        <button onClick={() => navigate('/patient/appointments')} className="text-sm text-primary font-bold hover:underline">View All</button>
                    </div>

                    {summary?.upcomingAppointments?.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📅</div>
                            <p className="text-gray-500 font-medium">No upcoming visits scheduled.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {summary?.upcomingAppointments?.map((appt: any) => (
                                <div key={appt._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition bg-gray-50/50">
                                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border">
                                            <FaUserMd />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Dr. {appt.doctorId?.userId?.name || 'Doctor'}</p>
                                            <p className="text-xs text-gray-500">{appt.doctorId?.specialization || 'Consultation'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            <p className="text-xs text-gray-500 font-medium">{appt.startTime}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Medical Records Widget */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaFileMedical className="text-orange-500" /> Recent Records
                        </h2>
                    </div>
                    {summary?.recentMedicalRecords?.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-sm font-medium">No recent medical history found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                            {summary?.recentMedicalRecords?.map((record: any, idx: number) => (
                                <div key={record._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-orange-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1rem)] p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-gray-900 text-sm">{record.diagnosis || 'General Checkup'}</div>
                                            <div className="text-xs text-gray-400 ml-2">{new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                        </div>
                                        <div className="text-xs text-gray-500">Dr. {record.doctorId?.userId?.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => navigate('/patient/medical-records')} className="w-full mt-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl text-sm transition transition">
                        View Complete History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientOverview;
