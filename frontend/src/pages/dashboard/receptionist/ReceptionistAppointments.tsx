import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCalendarPlusFill, BsCheckCircleFill, BsPersonWalking, BsXCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const ReceptionistAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/receptionist/appointments');
      setAppointments(res.data.data);
    } catch (err: any) {
      toast.error('Failed to load appointments queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCheckIn = async (id: string) => {
    try {
      await axiosInstance.put(`/api/receptionist/appointments/${id}/checkin`, {});
      toast.success('Patient checked in and moved to Clinical Queue');
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to check-in patient');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
      'Scheduled': 'bg-blue-100 text-blue-700',
      'CheckedIn': 'bg-amber-100 text-amber-700',
      'waiting': 'bg-orange-100 text-orange-700',
      'vitals_recorded': 'bg-indigo-100 text-indigo-700',
      'ready_for_doctor': 'bg-emerald-100 text-emerald-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || styles['Scheduled']}`}>{status.replace('_', ' ')}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daily Schedule & Check-in</h1>
          <p className="text-gray-500 mt-2">Manage today's appointments and walk-in flows.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Today's Appointment Ledger</h3>
          <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-bold">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                    <td className="px-6 py-4"><Skeleton width={130} /></td>
                    <td className="px-6 py-4"><Skeleton width={120} /></td>
                    <td className="px-6 py-4"><Skeleton width={90} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                  </tr>
                ))
              ) : appointments.length > 0 ? (
                appointments.map((apt: any) => (
                  <tr key={apt._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-bold text-gray-800">{apt.startTime} - {apt.endTime}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{apt.patientId?.name || 'Unknown'}</span>
                      {apt.reason?.toLowerCase().includes('walk-in') && (
                        <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded uppercase font-black">Walk-in</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">Dr. {apt.doctorId?.userId?.name}</td>
                    <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        {apt.status === 'Scheduled' && (
                          <button
                            title="Check In"
                            onClick={() => handleCheckIn(apt._id)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                          >
                            Check In
                          </button>
                        )}
                        {(['Scheduled', 'CheckedIn'].includes(apt.status)) && (
                          <button
                            title="Cancel Appointment"
                            onClick={() => toast.info('Advanced UI for cancellation pending (Requires Reason Modal)')}
                            className="text-red-500 hover:text-red-600 bg-red-50 p-1.5 rounded-lg transition"
                          >
                            <BsXCircleFill />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No appointments scheduled for today.
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

export default ReceptionistAppointments;
