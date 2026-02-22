import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsSearch, BsShieldLockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminMedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axiosInstance.get('/admin/medical-records');
        setRecords(res.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch medical records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">EMR Oversight</h1>
          <p className="text-gray-500 mt-2 flex items-center">
            <BsShieldLockFill className="text-amber-500 mr-2" />
            Strictly Read-Only access for compliance monitoring.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-600">Showing all records chronologically</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Filing Doctor</th>
                <th className="px-6 py-4">Diagnosis</th>
                <th className="px-6 py-4 text-center">Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={200} /></td>
                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                  </tr>
                ))
              ) : records.length > 0 ? (
                records.map((rec: any) => (
                  <tr key={rec._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{new Date(rec.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{rec.patientId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-600">Dr. {rec.doctorId?.userId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-600">{rec.diagnosis}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                        <BsShieldLockFill /> <span>Locked</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No medical records found in the system.
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

export default AdminMedicalRecords;
