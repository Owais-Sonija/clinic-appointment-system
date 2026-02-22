import React from 'react';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { BsDownload, BsGraphUp, BsShieldLock, BsActivity } from 'react-icons/bs';

const Reports = () => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Advanced Analytics</h2>
                    <p className="text-gray-500 font-medium">Global clinic performance, revenue trends, and operational efficiency.</p>
                </div>
                <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all hover:bg-black">
                    <BsDownload className="text-xl" />
                    <span>Export Full Report</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-gray-800">Revenue Growth (Annual)</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">2026</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Line
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                    datasets: [{
                                        label: 'Revenue',
                                        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 42000, 38000, 45000, 50000],
                                        borderColor: '#3b82f6',
                                        borderWidth: 4,
                                        pointRadius: 0,
                                        tension: 0.4,
                                        fill: true,
                                        backgroundColor: 'rgba(59, 130, 246, 0.05)'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { display: false }, x: { grid: { display: false }, border: { display: false } } }
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Patient Acquisition</h3>
                            <div className="h-60">
                                <Bar
                                    data={{
                                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                                        datasets: [{
                                            data: [45, 60, 35, 80],
                                            backgroundColor: '#6366f1',
                                            borderRadius: 10
                                        }]
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Appointment Status</h3>
                            <div className="h-60">
                                <Pie
                                    data={{
                                        labels: ['Completed', 'Pending', 'Cancelled'],
                                        datasets: [{
                                            data: [70, 20, 10],
                                            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                                            borderWidth: 0
                                        }]
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
                        <BsGraphUp className="text-4xl mb-6 opacity-50" />
                        <h4 className="text-lg font-bold opacity-80 uppercase tracking-widest">Clinic Efficiency</h4>
                        <h2 className="text-5xl font-black mt-2">94%</h2>
                        <p className="mt-4 text-sm text-blue-100">Overall operations are running at peak performance based on patient feedback and wait times.</p>
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span>Avg Wait Time</span>
                                <span className="font-bold">12 mins</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>Recovery Rate</span>
                                <span className="font-bold">98.2%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Security & Audits</h3>
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl mb-4">
                            <BsShieldLock className="text-2xl text-emerald-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Audit Logs</p>
                                <p className="text-xs text-gray-500">128 Critical actions logged today</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                            <BsActivity className="text-2xl text-blue-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">System Health</p>
                                <p className="text-xs text-gray-500">All services operational</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
