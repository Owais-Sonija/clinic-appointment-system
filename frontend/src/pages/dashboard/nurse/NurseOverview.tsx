import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsPeopleFill, BsClockFill, BsCheckCircleFill, BsListTask } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

interface NurseSummary {
  totalToday: number;
  waiting: number;
  vitalsRecorded: number;
  readyForDoctor: number;
  completedToday: number;
}

const NurseOverview: React.FC = () => {
  const [summary, setSummary] = useState<NurseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axiosInstance.get('/api/nurse/dashboard-summary');
        setSummary(res.data.data);
      } catch (err: any) {
        toast.error('Failed to fetch nurse dashboard summary');
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
          <h1 className="text-3xl font-bold text-gray-800">Nurse Dashboard</h1>
          <p className="text-gray-500 mt-2">Daily Clinical Support Overview</p>
        </div>
        <Link to="/nurse/appointments" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm flex items-center space-x-2">
          <BsListTask />
          <span>View Patient Queue</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Today" value={summary?.totalToday} loading={loading} icon={<BsPeopleFill />} color="blue" />
        <StatCard title="Waiting (Queue)" value={summary?.waiting} loading={loading} icon={<BsClockFill />} color="amber" />
        <StatCard title="Vitals Done" value={summary?.vitalsRecorded} loading={loading} icon={<BsCheckCircleFill />} color="purple" />
        <StatCard title="Ready for Doctor" value={summary?.readyForDoctor} loading={loading} icon={<BsCheckCircleFill />} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
            <BsPeopleFill size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Clinical Workflow</h3>
          <p className="text-gray-500 mt-2 max-w-sm">Efficiently manage the patient journey from check-in to consultation. Ensure vitals are recorded accurately for every patient.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Shift Priorities</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <div className="mt-1 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
              <p className="text-gray-600 text-sm">Prioritize patients waiting in the queue for more than 15 minutes.</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="mt-1 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
              <p className="text-gray-600 text-sm">Verify allergy reports for new patients before marking as "Ready".</p>
            </li>
            <li className="flex items-start space-x-3">
              <div className="mt-1 w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
              <p className="text-gray-600 text-sm">Maintain clean and calibrated diagnostic tools (BP cuff, thermometer).</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, loading, icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border ${colorMap[color].split(' ')[2]} flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">
          {loading ? <Skeleton width={50} /> : value || 0}
        </h3>
      </div>
      <div className={`p-4 rounded-xl text-xl ${colorMap[color].split(' ').slice(0, 2).join(' ')}`}>
        {icon}
      </div>
    </div>
  );
};

export default NurseOverview;
