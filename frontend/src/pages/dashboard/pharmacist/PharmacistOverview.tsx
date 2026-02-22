import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCheckCircleFill, BsExclamationTriangleFill, BsClockHistory, BsCurrencyDollar, BsArrowRightShort, BsCapsule } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

const PharmacistOverview: React.FC = () => {
    const [summary, setSummary] = useState<any>(null);
    const [alerts, setAlerts] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const [summaryRes, alertsRes] = await Promise.all([
                axiosInstance.get('/api/pharmacist/dashboard-summary'),
                axiosInstance.get('/api/pharmacist/alerts')
            ]);
            setSummary(summaryRes.data.data);
            setAlerts(alertsRes.data.data);
        } catch (error) {
            toast.error('Failed to load pharmacy dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const StatCard = ({ title, value, icon, color }: any) => {
        const colors: any = {
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            red: 'bg-red-50 text-red-600 border-red-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-100',
            blue: 'bg-blue-50 text-blue-600 border-blue-100'
        };
        const cMap = colors[color] || colors.indigo;

        return (
            <div className={`bg-white p-6 rounded-2xl shadow-sm border ${cMap.split(' ')[2]} flex items-center justify-between`}>
                <div>
                    <h4 className="text-gray-500 font-medium text-sm mb-1">{title}</h4>
                    <p className="text-3xl font-black text-gray-800">
                        {loading ? <Skeleton width={40} /> : value}
                    </p>
                </div>
                <div className={`p-4 rounded-xl text-xl ${cMap.split(' ').slice(0, 2).join(' ')}`}>
                    {icon}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <BsCapsule className="mr-3 text-indigo-600" />
                        Pharmacy Overview
                    </h1>
                    <p className="text-gray-500 mt-2">Manage prescriptions, track inventory, and handle billing.</p>
                </div>
                <div className="flex space-x-3">
                    <Link to="/pharmacist/inventory" className="bg-white border border-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm">
                        Stock Directory
                    </Link>
                    <Link to="/pharmacist/prescriptions" className="bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center">
                        Dispense Queue <BsArrowRightShort className="ml-1 text-xl" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Pending Prescriptions"
                    value={summary?.pendingPrescriptions || 0}
                    icon={<BsClockHistory />}
                    color="amber"
                />
                <StatCard
                    title="Dispensed Today"
                    value={summary?.dispensedToday || 0}
                    icon={<BsCheckCircleFill />}
                    color="emerald"
                />
                <StatCard
                    title="Low Stock Items"
                    value={summary?.lowStockItems || 0}
                    icon={<BsExclamationTriangleFill />}
                    color="red"
                />
                <StatCard
                    title="Expiring Soon (30d)"
                    value={summary?.expiringItems || 0}
                    icon={<BsExclamationTriangleFill />}
                    color="amber"
                />
                <StatCard
                    title="Revenue Today"
                    value={`$${summary?.revenueToday?.toFixed(2) || '0.00'}`}
                    icon={<BsCurrencyDollar />}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Low Stock Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center">
                        <BsExclamationTriangleFill className="text-red-500 mr-2" />
                        <h3 className="font-bold text-red-900">Critical Low Stock Alerts</h3>
                    </div>
                    <div className="p-0">
                        {loading ? (
                            <div className="p-4"><Skeleton count={3} /></div>
                        ) : alerts?.lowStock?.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {alerts.lowStock.map((item: any) => (
                                    <li key={item._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-bold text-gray-800">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-red-100 text-red-700 text-xs font-black px-2 py-1 rounded-full">{item.totalStock} left</span>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Threshold: {item.reorderThreshold}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <BsCheckCircleFill className="mx-auto text-3xl text-emerald-400 mb-2" />
                                <p>All inventory levels are healthy.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Expiry Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
                    <div className="bg-amber-50 p-4 border-b border-amber-100 flex items-center">
                        <BsClockHistory className="text-amber-500 mr-2" />
                        <h3 className="font-bold text-amber-900">Expiring Soon (Next 30 Days)</h3>
                    </div>
                    <div className="p-0">
                        {loading ? (
                            <div className="p-4"><Skeleton count={3} /></div>
                        ) : alerts?.expiring?.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {alerts.expiring.map((item: any) => {
                                    const nextExpiringBatch = item.batches.sort((a: any, b: any) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())[0];

                                    return (
                                        <li key={item._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                                            <div>
                                                <p className="font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs font-mono text-gray-500">Batch: {nextExpiringBatch?.batchNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-1 rounded">{new Date(nextExpiringBatch?.expiryDate).toLocaleDateString()}</span>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Qty: {nextExpiringBatch?.quantity}</p>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <BsCheckCircleFill className="mx-auto text-3xl text-emerald-400 mb-2" />
                                <p>No batches expiring within 30 days.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacistOverview;
