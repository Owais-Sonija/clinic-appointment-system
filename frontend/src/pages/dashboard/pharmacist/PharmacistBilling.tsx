import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCheckCircleFill, BsFileEarmarkTextFill, BsCurrencyDollar } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const PharmacistBilling: React.FC = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/pharmacist/invoices');
            setInvoices(res.data.data);
        } catch (error) {
            toast.error('Failed to load pharmacy billing records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handlePay = async (id: string, method: string) => {
        try {
            await axiosInstance.put(`/api/pharmacist/invoices/${id}/pay`, { paymentMethod: method });
            toast.success(`Invoice marked Paid via ${method}`);
            fetchInvoices();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to record payment');
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
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <BsCurrencyDollar className="mr-2 text-indigo-600" />
                        Pharmacy POS & Billing
                    </h1>
                    <p className="text-gray-500 mt-2">Manage out-of-pocket pharmacy receivables and generate receipts.</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-medium shadow-sm flex items-center space-x-2">
                    <BsFileEarmarkTextFill />
                    <span onClick={() => toast.info('Advanced POS generating UI disconnected in minimal build')}>New Transaction</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Invoice Ref</th>
                                <th className="px-6 py-4">Patient Profile</th>
                                <th className="px-6 py-4 text-right">Net Amout</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Cashier Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
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
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-800">
                                            #{inv._id.substr(-8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {inv.patientId?.name || 'Walk-in Consumer'}
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-800 text-right">
                                            ${inv.netAmount?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <StatusBadge status={inv.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {inv.status !== 'Paid' ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => handlePay(inv._id, 'Card')} className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition">Card</button>
                                                    <button onClick={() => handlePay(inv._id, 'Cash')} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition">Cash</button>
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
                                        No pharmacy invoices recorded yet.
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

export default PharmacistBilling;
