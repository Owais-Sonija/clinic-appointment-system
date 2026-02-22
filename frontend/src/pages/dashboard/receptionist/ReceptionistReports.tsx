import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsGraphUp, BsCash, BsPeopleFill, BsXCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const ReceptionistReports: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get('/api/receptionist/reports');
        setReports(res.data.data);
      } catch (err: any) {
        toast.error('Failed to load operational reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Daily Operational Report</h1>
        <p className="text-gray-500 mt-2">End-of-day summary tailored for front-desk handovers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <BsCash size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Daily Revenue</h3>
          </div>
          <p className="text-4xl font-black text-gray-800">
            {loading ? <Skeleton width={80} /> : `$${reports?.revenueCollectedToday?.toFixed(2) || '0.00'}`}
          </p>
        </div>

        {/* Walk-ins */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BsPeopleFill size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Walk-ins Handled</h3>
          </div>
          <p className="text-4xl font-black text-gray-800">
            {loading ? <Skeleton width={40} /> : reports?.walkInsPerDay || 0}
          </p>
        </div>

        {/* Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BsGraphUp size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Total Bookings</h3>
          </div>
          <p className="text-4xl font-black text-gray-800">
            {loading ? <Skeleton width={40} /> : reports?.appointmentsPerDay || 0}
          </p>
        </div>

        {/* Cancellations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <BsXCircleFill size={24} />
            </div>
            <h3 className="font-bold text-gray-700">Cancellations</h3>
          </div>
          <p className="text-4xl font-black text-gray-800">
            {loading ? <Skeleton width={40} /> : reports?.cancellationsPerDay || 0}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start space-x-4">
        <span className="text-2xl">📋</span>
        <div>
          <h4 className="font-bold text-blue-900">End of Shift Protocol</h4>
          <p className="text-sm text-blue-800 mt-1">Please ensure all collected cash matches the Daily Revenue stated above before handing over the desk. Any discrepancies should be reported to the Clinic Administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistReports;
