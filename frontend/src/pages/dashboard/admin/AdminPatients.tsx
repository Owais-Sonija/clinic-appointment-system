import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsSearch, BsCheckCircleFill, BsXCircleFill, BsLockFill, BsUnlockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/patients?search=${search}`);
      setPatients(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const toggleStatus = async (patient: any) => {
    try {
      const newStatus = !patient.isActive;
      await axiosInstance.patch(`/admin/patients/${patient._id}/status`, { isActive: newStatus });
      toast.success(`Patient account ${newStatus ? 'unlocked' : 'locked'} successfully`);
      fetchPatients();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update patient status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Directory</h1>
          <p className="text-gray-500 mt-2">Manage patient accounts and system access.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <div className="relative w-full max-w-md">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Reg Date</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={120} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={50} /></td>
                  </tr>
                ))
              ) : patients.length > 0 ? (
                patients.map((pat: any) => (
                  <tr key={pat._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{pat.name}</td>
                    <td className="px-6 py-4 text-gray-500">{pat.email}</td>
                    <td className="px-6 py-4 text-gray-500">{pat.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(pat.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {pat.isActive ? (
                        <span className="flex items-center text-emerald-600 font-medium"><BsCheckCircleFill className="mr-2" /> Active</span>
                      ) : (
                        <span className="flex items-center text-red-500 font-medium"><BsLockFill className="mr-2" /> Locked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center space-x-3">
                      <button
                        onClick={() => toggleStatus(pat)}
                        title={pat.isActive ? 'Lock Account' : 'Unlock Account'}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold ${pat.isActive ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                      >
                        {pat.isActive ? (
                          <><BsLockFill /> <span>Lock</span></>
                        ) : (
                          <><BsUnlockFill /> <span>Unlock</span></>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No patients match your search.
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

export default AdminPatients;
