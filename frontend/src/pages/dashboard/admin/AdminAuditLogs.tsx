import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsClockHistory, BsShieldLockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get('/admin/audit-logs');
        setLogs(res.data.data);
      } catch (err: any) {
        toast.error('Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Audit Logs</h1>
          <p className="text-gray-500 mt-2">Immutable record of critical administrative actions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center text-sm text-amber-600 font-medium font-mono">
          <BsShieldLockFill className="mr-2" /> WORM (Write Once Read Many) Compliant Storage Active
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 font-mono">
            <thead className="bg-gray-800 text-gray-200 uppercase font-semibold text-xs border-b border-gray-700">
              <tr>
                <th className="px-6 py-4">Timestamp (UTC)</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={140} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={200} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center">
                      <BsClockHistory className="mr-2 text-gray-400" />
                      {new Date(log.timestamp).toISOString().replace('T', ' ').substr(0, 19)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{log.userId?.email || 'SYSTEM'}</td>
                    <td className="px-6 py-4 text-blue-600 font-bold">{log.action}</td>
                    <td className="px-6 py-4 text-gray-600">[{log.entity}] {log.entityId}</td>
                    <td className="px-6 py-4 text-gray-500">{log.ipAddress || '::1'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No system audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
