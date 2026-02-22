import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsSearch, BsClockFill, BsCheckCircleFill, BsClipboardPulse, BsPencilSquare, BsArrowRightCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

const NurseAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/nurse/appointments${filter !== 'All' ? `?status=${filter}` : ''}`);
      setAppointments(res.data.data);
    } catch (err: any) {
      toast.error('Failed to fetch patient queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filter]);

  const markReady = async (id: string) => {
    try {
      await axiosInstance.put(`/api/nurse/appointments/${id}/status`, { status: 'ready_for_doctor' });
      toast.success('Patient is now marked as Ready for Doctor');
      fetchQueue();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
      'Scheduled': 'bg-amber-100 text-amber-700',
      'vitals_recorded': 'bg-blue-100 text-blue-700',
      'ready_for_doctor': 'bg-emerald-100 text-emerald-700',
      'Completed': 'bg-gray-100 text-gray-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || styles['Scheduled']}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clinical Queue</h1>
          <p className="text-gray-500 mt-2">Manage daily appointments and prepare patients for consultation.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex space-x-2">
            {['All', 'Scheduled', 'vitals_recorded', 'ready_for_doctor'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === st ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                {st === 'All' ? 'Full Queue' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Check-in Actions</th>
                <th className="px-6 py-4 text-center">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                  </tr>
                ))
              ) : appointments.length > 0 ? (
                appointments.map((apt: any) => (
                  <tr key={apt._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-bold text-gray-800">{apt.time}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{apt.patientId?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">Dr. {apt.doctorId?.userId?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/nurse/appointments/${apt._id}/vitals`}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          title="Record Vitals"
                        >
                          <BsClipboardPulse size={18} />
                        </Link>
                        <Link
                          to={`/nurse/appointments/${apt._id}/notes`}
                          className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                          title="Nursing Notes"
                        >
                          <BsPencilSquare size={18} />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {apt.status === 'vitals_recorded' ? (
                        <button
                          onClick={() => markReady(apt._id)}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center mx-auto"
                        >
                          Mark Ready <BsArrowRightCircleFill className="ml-2" />
                        </button>
                      ) : apt.status === 'ready_for_doctor' ? (
                        <span className="text-emerald-600 font-bold text-xs">Waiting for MD</span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Record Vitals First</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    The queue is empty for today.
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

export default NurseAppointments;
