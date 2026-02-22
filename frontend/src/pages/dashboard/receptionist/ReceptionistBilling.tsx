import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCreditCardFill, BsFileEarmarkTextFill, BsCheckCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const ReceptionistBilling: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/receptionist/invoices');
      setInvoices(res.data.data);
    } catch (err: any) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async (id: string, method: string) => {
    try {
      await axiosInstance.put(`/api/receptionist/invoices/${id}/pay`, { method });
      toast.success(`Invoice marked as Paid via ${method}`);
      fetchInvoices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Billing & Receivables</h1>
          <p className="text-gray-500 mt-2">Manage patient invoices and record frontend payments.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm flex items-center space-x-2">
          <BsFileEarmarkTextFill />
          <span>Generate Invoice</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Process Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={120} /></td>
                    <td className="px-6 py-4"><Skeleton width={60} /></td>
                    <td className="px-6 py-4"><Skeleton width={80} /></td>
                    <td className="px-6 py-4"><Skeleton width={100} /></td>
                  </tr>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((inv: any) => (
                  <tr key={inv._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-800">#{inv._id.substr(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{inv.patientId?.name || 'Unknown Patient'}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-800">${inv.amount?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                    <td className="px-6 py-4 text-center">
                      {inv.status !== 'Paid' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => handlePay(inv._id, 'Card')} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-100 transition">Card</button>
                          <button onClick={() => handlePay(inv._id, 'Cash')} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-100 transition">Cash</button>
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center justify-center space-x-1 text-xs">
                          <BsCheckCircleFill /> <span>{inv.paymentMethod}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No invoices generated yet.
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

export default ReceptionistBilling;
