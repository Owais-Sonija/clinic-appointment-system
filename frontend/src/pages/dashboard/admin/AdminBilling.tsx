import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCashStack, BsGraphUp, BsReceipt, BsClockHistory } from 'react-icons/bs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

interface RevenueSummary {
  totalRevenue: number;
  monthlyRevenue: { month: number, revenue: number }[];
  unpaidAmount: number;
  unpaidCount: number;
}

const AdminBilling: React.FC = () => {
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const [summaryRes, invoicesRes] = await Promise.all([
          axiosInstance.get('/admin/revenue-summary'),
          axiosInstance.get('/admin/invoices')
        ]);
        setSummary(summaryRes.data.data);
        setInvoices(invoicesRes.data.data);
      } catch (err: any) {
        toast.error('Failed to fetch billing data');
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = summary?.monthlyRevenue.map(item => ({
    name: monthNames[item.month - 1],
    revenue: item.revenue
  })) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financial Terminal</h1>
          <p className="text-gray-500 mt-2">Clinic revenue, billing cycles, and invoice oversight.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue (Paid)</p>
            <h3 className="text-3xl font-bold text-emerald-600">
              {loading ? <Skeleton width={100} /> : `$${summary?.totalRevenue.toLocaleString()}`}
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 text-xl">
            <BsCashStack />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Outstanding Amount</p>
            <h3 className="text-3xl font-bold text-amber-600">
              {loading ? <Skeleton width={100} /> : `$${summary?.unpaidAmount.toLocaleString()}`}
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 text-amber-600 text-xl">
            <BsGraphUp />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Invoices</p>
            <h3 className="text-3xl font-bold text-blue-600">
              {loading ? <Skeleton width={60} /> : summary?.unpaidCount}
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600 text-xl">
            <BsReceipt />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <BsGraphUp className="mr-2 text-blue-600" /> Revenue Growth (Monthly)
        </h2>
        <div className="h-64">
          {loading ? (
            <Skeleton height="100%" className="rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={150} /></td>
                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                  </tr>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((inv: any) => (
                  <tr key={inv._id} className="hover:bg-gray-50/50 transition font-medium">
                    <td className="px-6 py-4 text-gray-900">INV-{inv._id.substr(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 text-gray-700">{inv.patientId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(inv.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                    No financial transactions found.
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

export default AdminBilling;
