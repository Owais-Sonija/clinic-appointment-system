import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsSearch, BsCheckCircleFill, BsXCircleFill, BsPencilSquare, BsTrash, BsPlusLg } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/doctors?search=${search}`);
      setDoctors(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const toggleStatus = async (doctor: any) => {
    try {
      const newStatus = !doctor.isActive;
      await axiosInstance.patch(`/admin/doctors/${doctor._id}/status`, { isActive: newStatus });
      toast.success(`Doctor ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchDoctors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>
          <p className="text-gray-500 mt-2">Add, edit, and control clinical staff access.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm">
          <BsPlusLg />
          <span>Add New Doctor</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center">
          <div className="relative w-full max-w-md">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name or email..."
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
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Status</th>
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
                    <td className="px-6 py-4"><Skeleton width={50} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={50} /></td>
                  </tr>
                ))
              ) : doctors.length > 0 ? (
                doctors.map((doc: any) => (
                  <tr key={doc._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{doc.userId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-500">{doc.userId?.email || 'N/A'}</td>
                    <td className="px-6 py-4 bg-blue-50 text-blue-700 font-medium inline-block rounded-xl px-3 py-1 mt-3 ml-6">{doc.specialization}</td>
                    <td className="px-6 py-4">${doc.consultationFee}</td>
                    <td className="px-6 py-4">
                      {doc.isActive ? (
                        <span className="flex items-center text-emerald-600 font-medium"><BsCheckCircleFill className="mr-2" /> Active</span>
                      ) : (
                        <span className="flex items-center text-red-500 font-medium"><BsXCircleFill className="mr-2" /> Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center space-x-3">
                      <button
                        onClick={() => toggleStatus(doc)}
                        title={doc.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-2 rounded-lg transition-colors ${doc.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                      >
                        {doc.isActive ? <BsXCircleFill size={18} /> : <BsCheckCircleFill size={18} />}
                      </button>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Doctor">
                        <BsPencilSquare size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No doctors match your search.
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

export default AdminDoctors;
