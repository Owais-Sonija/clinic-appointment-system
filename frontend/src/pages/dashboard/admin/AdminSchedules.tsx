import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCalendar3, BsClockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axiosInstance.get('/admin/schedules');
        setSchedules(res.data.data);
      } catch (err: any) {
        toast.error('Failed to fetch clinic schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clinic Schedules</h1>
          <p className="text-gray-500 mt-2">Global oversight of doctor availability and clinical hours.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Skeleton height={24} width={200} className="mb-4" />
              <Skeleton count={3} />
            </div>
          ))
        ) : schedules.length > 0 ? (
          schedules.map((doc: any) => (
            <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                    {doc.userId?.name?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Dr. {doc.userId?.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{doc.specialization}</p>
                  </div>
                </div>
                <BsCalendar3 className="text-gray-300 text-2xl" />
              </div>

              <div className="space-y-3">
                {doc.availability && doc.availability.length > 0 ? (
                  doc.availability.map((slot: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-semibold text-gray-700">{slot.day}</span>
                      <div className="flex items-center text-gray-600">
                        <BsClockFill className="mr-2 text-blue-500" />
                        <span className="text-sm">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">No availability set for this doctor.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium">
            No active doctor schedules found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchedules;
