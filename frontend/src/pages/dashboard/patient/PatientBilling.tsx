import React from 'react';
import { FaFileInvoiceDollar, FaCheckCircle, FaExclamationCircle, FaDownload } from 'react-icons/fa';
import EmptyState from '../../../components/EmptyState';

// Currently using mock data as the Billing Module backend is not fully implemented
const mockInvoices = [
    { id: 'INV-2023-001', service: 'General Checkup', date: '2023-10-15', amount: 150.00, status: 'Paid' },
    { id: 'INV-2023-002', service: 'Blood Test Panel', date: '2023-11-02', amount: 85.50, status: 'Paid' },
    { id: 'INV-2023-003', service: 'Dental Consultation', date: '2023-12-05', amount: 200.00, status: 'Pending' },
];

const PatientBilling = () => {
    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-in">
            <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
                <p className="text-gray-500 mt-1">Review your payment history and outstanding balances.</p>
            </div>

            {/* Account Summary Mini-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl"><FaFileInvoiceDollar /></div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Billed</p>
                        <h3 className="text-2xl font-bold text-gray-900">$435.50</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl"><FaCheckCircle /></div>
                    <div>
                        <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wider">Total Paid</p>
                        <h3 className="text-2xl font-bold text-emerald-900">$235.50</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl"><FaExclamationCircle /></div>
                    <div>
                        <p className="text-orange-700 text-sm font-semibold uppercase tracking-wider">Outstanding</p>
                        <h3 className="text-2xl font-bold text-orange-900">$200.00</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Recent Invoices</h3>
                </div>
                {mockInvoices.length === 0 ? (
                    <div className="p-8">
                        <EmptyState title="No Invoices" description="You have no billing records available." icon="💰" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Invoice ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Service</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {mockInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-primary">{inv.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{inv.service}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inv.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">${inv.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="text-gray-400 hover:text-primary transition p-2" title="Download Invoice">
                                                <FaDownload />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientBilling;
