import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsShieldLockFill, BsFilterCircleFill } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

const AdminAuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterEntity, setFilterEntity] = useState('');

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const query = filterEntity ? `?entity=${filterEntity}` : '';
            const res = await axiosInstance.get(`/api/admin/audit-logs${query}`);
            setLogs(res.data.data);
        } catch (error) {
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filterEntity]);

    const getActionColor = (action: string) => {
        if (action.includes('CREATE') || action.includes('DISPENSE')) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (action.includes('UPDATE')) return 'text-blue-600 bg-blue-50 border-blue-100';
        if (action.includes('DELETE') || action.includes('CANCEL')) return 'text-red-600 bg-red-50 border-red-100';
        if (action.includes('OVERRIDE')) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-gray-600 bg-gray-50 border-gray-100';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 flex items-center">
                        <BsShieldLockFill className="mr-3 text-indigo-600" />
                        System Audit Logs
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Immutable tracking of sensitive administrative and operational actions.</p>
                </div>

                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                    <BsFilterCircleFill className="text-gray-400" />
                    <select
                        className="bg-transparent border-none text-sm font-bold text-gray-700 outline-none"
                        value={filterEntity}
                        onChange={(e) => setFilterEntity(e.target.value)}
                    >
                        <option value="">All Entities</option>
                        <option value="User">Users</option>
                        <option value="Appointment">Appointments</option>
                        <option value="Prescription">Prescriptions</option>
                        <option value="Medicine">Medicines</option>
                        <option value="Invoice">Invoices</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-white text-gray-400 uppercase font-black tracking-wider text-[10px] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Action Type</th>
                                <th className="px-6 py-4">Target Entity</th>
                                <th className="px-6 py-4">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 15 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton width={120} /></td>
                                        <td className="px-6 py-4"><Skeleton width={130} /></td>
                                        <td className="px-6 py-4"><Skeleton width={140} /></td>
                                        <td className="px-6 py-4"><Skeleton width={80} /></td>
                                        <td className="px-6 py-4"><Skeleton width={100} /></td>
                                    </tr>
                                ))
                            ) : logs.length > 0 ? (
                                logs.map((log: any) => (
                                    <tr key={log._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-3 font-mono text-xs text-gray-500 font-semibold whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            <p className="font-bold text-gray-800">{log.userId?.name || 'System'}</p>
                                            <p className="text-[10px] uppercase font-black tracking-wide text-gray-400">{log.role}</p>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <p className="font-bold text-gray-700">{log.entity}</p>
                                            <p className="text-[10px] font-mono text-gray-400 truncate max-w-[120px]" title={log.entityId}>{log.entityId}</p>
                                        </td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-500">
                                            {log.ipAddress || 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No audit records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Visual fading gradient footprint */}
                <div className="bg-gradient-to-t from-gray-50 to-transparent h-10 border-t border-gray-50"></div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
