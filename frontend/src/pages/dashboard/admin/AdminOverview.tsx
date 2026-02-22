import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsPeopleFill, BsCalendarCheckFill, BsClockHistory, BsActivity } from 'react-icons/bs';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  appointmentStatusBreakdown: { _id: string, count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminOverview: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard-summary');
        setSummary(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch admin summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const chartData = summary?.appointmentStatusBreakdown.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Enterprise Clinic Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value={summary?.totalPatients} loading={loading} icon={<BsPeopleFill />} color="blue" />
        <StatCard title="Total Doctors" value={summary?.totalDoctors} loading={loading} icon={<BsActivity />} color="emerald" />
        <StatCard title="Total Appointments" value={summary?.totalAppointments} loading={loading} icon={<BsClockHistory />} color="purple" />
        <StatCard title="Today's Appointments" value={summary?.todayAppointments} loading={loading} icon={<BsCalendarCheckFill />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Appointment Status Distribution</h2>
          <div className="flex-grow min-h-[300px]">
            {loading ? (
              <Skeleton height={300} className="rounded-xl" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" aspect={4 / 3}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No appointment data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center h-full">
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 w-full">
            <BsActivity className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">System Analytics Engine</h3>
            <p className="text-gray-500 mt-2 text-sm">More detailed revenue tracking and clinic velocity charts will appear here as the platform expands.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, loading, icon, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">
          {loading ? <Skeleton width={60} /> : value || 0}
        </h3>
      </div>
      <div className={`p-4 rounded-xl text-xl ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default AdminOverview;
