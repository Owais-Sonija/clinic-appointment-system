import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsSearch, BsPersonPlusFill, BsFileEarmarkPersonFill, BsCalendarPlusFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const ReceptionistPatients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/receptionist/patients?search=${search}`);
      setPatients(res.data.data);
    } catch (err) {
      toast.error('Failed to load patient directory');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.warning('Name and phone are required');
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post('/api/receptionist/patients', formData);
      toast.success('Patient registered successfully. Password defaults to Patient123!');
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '' });
      fetchPatients();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Directory</h1>
          <p className="text-gray-500 mt-2">Register new arrivals and lookup existing patient records.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm flex items-center space-x-2"
        >
          <BsPersonPlusFill />
          <span>Register New Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Patient Profile</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4">Registered On</th>
                <th className="px-6 py-4 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={120} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                  </tr>
                ))
              ) : patients.length > 0 ? (
                patients.map((pat: any) => (
                  <tr key={pat._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                          {pat.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{pat.name}</p>
                          <p className="text-xs text-gray-500 font-mono">ID: {pat._id.substr(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{pat.phone}</p>
                      <p className="text-xs text-gray-500">{pat.email || 'No email provided'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(pat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => toast.info('Booking implemented in Appointments section')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Book Appointment">
                          <BsCalendarPlusFill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <BsFileEarmarkPersonFill className="mr-2 text-blue-600" /> Rapid Registration
              </h3>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email (Optional)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-800 flex items-start space-x-3">
                <span className="text-xl">ℹ️</span>
                <p>A default highly-secure password <b>Patient123!</b> will be assigned. The account will be marked as verified immediately.</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                  {saving ? 'Registering...' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistPatients;
