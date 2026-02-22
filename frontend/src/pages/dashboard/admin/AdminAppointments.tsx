import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsSearch, BsCheckCircleFill, BsXCircleFill, BsExclamationTriangleFill, BsClockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/appointments${filter !== 'All' ? `?status=${filter}` : ''}`);
      setAppointments(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const handleOverride = async (id: string, newStatus: string) => {
    try {
      await axiosInstance.put(`/admin/appointments/${id}/status`, {
        status: newStatus,
        reason: 'Admin Override'
      });
      toast.success(`Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Override failed');
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Completed': return <BsCheckCircleFill className="text-emerald-500 mr-2" />;
      case 'Scheduled': return <BsClockFill className="text-blue-500 mr-2" />;
      case 'Cancelled': return <BsXCircleFill className="text-red-500 mr-2" />;
      case 'No Show': return <BsExclamationTriangleFill className="text-amber-500 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Global Appointments</h1>
          <p className="text-gray-500 mt-2">Monitor operations and override bookings if necessary.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex space-x-2">
            {['All', 'Scheduled', 'Completed', 'Cancelled', 'No Show'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === st ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {st}
              </button>
            ))}
          </div>
          <button className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Attending Doctor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Override Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={120} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                    <td className="px-6 py-4"><Skeleton width={120} /></td>
                  </tr>
                ))
              ) : appointments.length > 0 ? (
                appointments.map((apt: any) => (
                  <tr key={apt._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{apt.time}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{apt.patientId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">Dr. {apt.doctorId?.userId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 flex items-center font-medium mt-1">
                      <StatusIcon status={apt.status} /> {apt.status}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="text-sm bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) handleOverride(apt._id, e.target.value);
                        }}
                      >
                        <option value="" disabled>Force Status...</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No Show">No Show</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No appointments found matching this filter.
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

export default AdminAppointments;
