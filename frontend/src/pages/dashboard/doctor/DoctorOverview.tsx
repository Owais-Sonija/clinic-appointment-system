import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { FaCalendarCheck, FaCheckCircle, FaClock, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DoctorOverview = () => {
    const { user } = useContext(AuthContext)!;

    const { data: summary, isLoading } = useQuery({
        queryKey: ['doctor-summary'],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/doctor/dashboard-summary');
            return res.data.data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    const stats = [
        { title: "Today's Appts", value: summary?.todayAppts || 0, icon: <FaCalendarCheck />, color: "blue" },
        { title: "Upcoming", value: summary?.upcomingAppts || 0, icon: <FaClock />, color: "indigo" },
        { title: "Completed", value: summary?.completedAppts || 0, icon: <FaCheckCircle />, color: "green" },
        { title: "Cancelled", value: summary?.cancelledAppts || 0, icon: <FaTimesCircle />, color: "red" },
    ];

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="tour-doctor-welcome">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Dr. {user?.name}</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        View Today's Schedule
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 tour-doctor-stats">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:scale-110 transition-transform text-${stat.color}-600`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</h3>
                        <div className={`mt-4 h-1 w-12 rounded bg-${stat.color}-500`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm tour-doctor-charts">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaChartLine className="text-primary" /> Appointment Trends
                        </h2>
                        <select className="bg-gray-50 border-none rounded-lg text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-primary">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={summary?.monthlyStats || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="_id"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    tickFormatter={(val) => {
                                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                        return months[val - 1] || val;
                                    }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm tour-doctor-actions">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors group">
                            <span className="font-semibold text-sm">Add New Medical Record</span>
                            <FaCheckCircle className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors group">
                            <span className="font-semibold text-sm">Update Schedule</span>
                            <FaClock className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors group">
                            <span className="font-semibold text-sm">Patient Search</span>
                            <FaCalendarCheck className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">Clinic Alert</p>
                            <p className="text-sm text-orange-700 font-medium">You have 3 unsaved medical records from yesterday.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorOverview;
