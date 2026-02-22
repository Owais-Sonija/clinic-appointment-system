import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsPeopleFill, BsHeartPulseFill, BsCalendarCheckFill, BsCurrencyDollar, BsFileEarmarkMedicalFill, BsCheckCircleFill } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

const AdminOverview: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [revenue, setRevenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboards = async () => {
        try {
            const [summaryRes, revRes] = await Promise.all([
                axiosInstance.get('/api/admin/dashboard-summary'),
                axiosInstance.get('/api/admin/revenue-summary')
            ]);
            setSummary(summaryRes.data.data);
            setRevenue(revRes.data.data);
        } catch (error) {
            toast.error('Failed to load admin analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboards();
    }, []);

    const StatCard = ({ title, value, icon, color, subtitle }: any) => {
        const colors: any = {
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            red: 'bg-red-50 text-red-600 border-red-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            blue: 'bg-blue-50 text-blue-600 border-blue-100',
            purple: 'bg-purple-50 text-purple-600 border-purple-100'
        };
        const cMap = colors[color] || colors.indigo;

        return (
            <div className={`bg-white p-6 rounded-3xl shadow-sm border ${cMap.split(' ')[2]} flex flex-col justify-between h-full`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-2xl text-2xl ${cMap.split(' ').slice(0, 2).join(' ')}`}>
                        {icon}
                    </div>
                </div>
                <div>
                    <h4 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">{title}</h4>
                    <p className="text-4xl font-black text-gray-800">
                        {loading ? <Skeleton width={60} /> : value}
                    </p>
                    {subtitle && <p className="text-xs text-gray-400 font-medium mt-2">{subtitle}</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Analytics</h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time macro operations and financial overview.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-gray-500 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Sync Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value={summary?.totalPatients || 0}
                    icon={<BsPeopleFill />}
                    color="indigo"
                    subtitle="Registered platform-wide"
                />
                <StatCard
                    title="Active Clinical Staff"
                    value={summary?.totalDoctors || 0}
                    icon={<BsHeartPulseFill />}
                    color="emerald"
                    subtitle="Doctors & Specialists"
                />
                <StatCard
                    title="Appointments Today"
                    value={summary?.todayAppointments || 0}
                    icon={<BsCalendarCheckFill />}
                    color="blue"
                    subtitle="Across all departments"
                />
                <StatCard
                    title="Total Appointments"
                    value={summary?.totalAppointments || 0}
                    icon={<BsFileEarmarkMedicalFill />}
                    color="purple"
                    subtitle="Historical records"
                />
            </div>

            {/* Revenue Analytics Segment */}
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2 mt-10">Financial Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-end min-h-[160px]">
                    <BsCurrencyDollar className="absolute top-4 right-4 text-7xl opacity-20" />
                    <p className="text-emerald-100 font-bold uppercase tracking-wider text-sm mb-1 z-10">Total Collected Revenue</p>
                    <p className="text-5xl font-black z-10 text-white">
                        {loading ? <Skeleton width={120} baseColor="rgba(255,255,255,0.2)" highlightColor="rgba(255,255,255,0.4)" /> : `$${revenue?.totalRevenue?.toFixed(2) || '0.00'}`}
                    </p>
                </div>

                <div className="bg-white border text-red-600 border-red-100 rounded-3xl p-6 shadow-sm flex flex-col justify-end">
                    <p className="text-red-400 font-bold uppercase tracking-wider text-sm mb-1">Unpaid Dues</p>
                    <p className="text-4xl font-black">
                        {loading ? <Skeleton width={100} /> : `$${revenue?.unpaidAmount?.toFixed(2) || '0.00'}`}
                    </p>
                    <p className="text-sm font-medium mt-2 text-red-400">From {revenue?.unpaidCount || 0} pending invoices</p>
                </div>

                <div className="bg-white border text-indigo-600 border-indigo-100 rounded-3xl p-6 shadow-sm flex flex-col justify-end">
                    <p className="text-indigo-400 font-bold uppercase tracking-wider text-sm mb-1">Current Month Trend</p>
                    <div className="flex items-end space-x-2">
                        <p className="text-4xl font-black">
                            {loading ? <Skeleton width={100} /> : (revenue?.monthlyRevenue?.length > 0 ? `$${revenue.monthlyRevenue[revenue.monthlyRevenue.length - 1].revenue.toFixed(2)}` : '$0.00')}
                        </p>
                    </div>
                    <p className="text-sm font-medium mt-2 text-indigo-400 flex items-center">
                        <BsCheckCircleFill className="mr-1" /> Revenue mapping synchronized
                    </p>
                </div>
            </div>

            {/* Extra spacer */}
            <div className="h-8"></div>
        </div>
    );
};

export default AdminOverview;
