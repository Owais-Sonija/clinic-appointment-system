import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsPeopleFill, BsCalendarCheckFill, BsClockFill, BsXCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

const ReceptionistOverview: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axiosInstance.get('/api/receptionist/dashboard-summary');
        setSummary(res.data.data);
      } catch (err: any) {
        toast.error('Failed to load overview statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Front Desk Overview</h1>
          <p className="text-gray-500 mt-2">Manage daily check-ins, walk-ins, and appointments.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/receptionist/patients" className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium shadow-sm">
            Register Patient
          </Link>
          <Link to="/receptionist/appointments" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm flex items-center space-x-2">
            <span>Daily Queue</span>
            <BsArrowRightCircleFill />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Appts Today" value={summary?.totalToday} loading={loading} icon={<BsCalendarCheckFill />} color="blue" />
        <StatCard title="Checked-In" value={summary?.checkedIn} loading={loading} icon={<BsPeopleFill />} color="emerald" />
        <StatCard title="Waiting" value={summary?.waiting} loading={loading} icon={<BsClockFill />} color="amber" />
        <StatCard title="Cancellations" value={summary?.cancelledToday} loading={loading} icon={<BsXCircleFill />} color="red" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between mt-8">
        <div className="flex items-center space-x-6 mb-6 md:mb-0">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-100">
            <BsPeopleFill size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Operational Flow</h3>
            <p className="text-gray-500 max-w-lg mt-1">Check in arrivals promptiy to keep the clinical queue moving. Be aware of walk-in patients requiring emergency scheduling.</p>
          </div>
        </div>
        <div className="text-center bg-gray-50 p-6 rounded-2xl border border-gray-100 min-w-[200px]">
          <p className="text-sm font-bold uppercase text-gray-400 mb-1">Walk-ins Today</p>
          <h4 className="text-4xl font-black text-blue-600">{loading ? <Skeleton width={40} /> : summary?.walkInsToday || 0}</h4>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, loading, icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${colorMap[color].split(' ')[2]} flex items-center justify-between hover:shadow-md transition duration-300`}>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">
          {loading ? <Skeleton width={40} /> : value || 0}
        </h3>
      </div>
      <div className={`p-4 rounded-xl text-xl ${colorMap[color].split(' ').slice(0, 2).join(' ')}`}>
        {icon}
      </div>
    </div>
  );
};

export default ReceptionistOverview;
