import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import DataTable from 'react-data-table-component';
import { BsFileEarmarkPdf, BsCreditCard, BsPlusCircle, BsArrowRepeat } from 'react-icons/bs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

const fetchInvoices = async () => (await axiosInstance.get('/api/billing/invoices')).data?.data || [];

const Billing = () => {
    const { data: invoices = [], isLoading: queryLoading } = useQuery({ queryKey: ['billing-invoices'], queryFn: fetchInvoices });
    const [generating, setGenerating] = useState<string | null>(null);
    const [simulatedLoading, setSimulatedLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setSimulatedLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const isLoading = queryLoading || simulatedLoading;

    const generatePDF = async (invoice: any) => {
        setGenerating(invoice._id);
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(59, 130, 246);
            doc.text('MediClinic Enterprise', 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Invoice #: ${invoice.invoiceNumber || invoice._id.slice(-8).toUpperCase()}`, 14, 30);
            doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 14, 35);

            // Patient Info
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text('Bill To:', 14, 50);
            doc.setFont('helvetica', 'bold');
            doc.text(invoice.patientId?.name || 'Valued Patient', 14, 56);
            doc.setFont('helvetica', 'normal');
            doc.text(invoice.patientId?.email || '', 14, 61);

            // Table
            const tableData = invoice.items?.map((item: any) => [
                item.description || 'Medical Service',
                item.quantity || 1,
                `$${item.unitPrice || invoice.totalAmount}`,
                `$${(item.quantity || 1) * (item.unitPrice || invoice.totalAmount)}`
            ]) || [['Consultation / Service', 1, `$${invoice.totalAmount}`, `$${invoice.totalAmount}`]];

            autoTable(doc, {
                startY: 75,
                head: [['Description', 'Qty', 'Unit Price', 'Total']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [59, 130, 246] }
            });

            // Summary
            const finalY = (doc as any).lastAutoTable.finalY + 10;
            doc.setFontSize(14);
            doc.text(`Grand Total: $${invoice.totalAmount}`, 140, finalY);

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text('Thank you for choosing MediClinic. For billing inquiries, contact billing@mediclinic.com', 14, 280);

            doc.save(`Invoice_${invoice.invoiceNumber || 'INV'}.pdf`);
            toast.success('PDF generated successfully!');
        } catch (err) {
            toast.error('Failed to generate PDF');
        } finally {
            setGenerating(null);
        }
    };

    const columns = [
        {
            name: 'Invoice / Patient',
            selector: (row: any) => row.invoiceNumber,
            sortable: true,
            cell: (row: any) => (
                <div className="flex flex-col py-3">
                    <span className="font-bold text-gray-900">{row.invoiceNumber || `INV-${row._id.slice(-6).toUpperCase()}`}</span>
                    <span className="text-xs text-gray-500 font-medium">{row.patientId?.name}</span>
                </div>
            )
        },
        {
            name: 'Amount',
            selector: (row: any) => row.totalAmount,
            sortable: true,
            cell: (row: any) => <span className="font-black text-gray-800">${row.totalAmount}</span>
        },
        {
            name: 'Status',
            selector: (row: any) => row.paymentStatus,
            sortable: true,
            cell: (row: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {row.paymentStatus}
                </span>
            )
        },
        {
            name: 'Actions',
            cell: (row: any) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => generatePDF(row)}
                        disabled={generating === row._id}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition border border-red-100 disabled:opacity-50"
                    >
                        {generating === row._id ? <BsArrowRepeat className="animate-spin" /> : <BsFileEarmarkPdf />}
                        PDF
                    </button>
                    {row.paymentStatus !== 'Paid' && (
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition">
                            <BsCreditCard /> Pay
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Billing & Invoicing</h2>
                    <p className="text-gray-500 font-medium">Track payments, generate professional PDF invoices, and manage accounts.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all">
                    <BsPlusCircle className="text-xl" />
                    <span>Create Invoice</span>
                </button>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Skeleton height={120} className="rounded-2xl" />
                            <Skeleton height={120} className="rounded-2xl" />
                            <Skeleton height={120} className="rounded-2xl" />
                        </div>
                        <Skeleton height={40} className="mb-4" />
                        <Skeleton count={4} height={60} className="mb-2" />
                    </SkeletonTheme>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Summary Cards */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
                            <div className="text-3xl font-black text-gray-900">$24,850.00</div>
                            <div className="text-emerald-500 text-xs font-bold mt-1">↑ 12% from last month</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Pending Invoices</h3>
                            <div className="text-3xl font-black text-amber-500">14</div>
                            <div className="text-gray-400 text-xs font-bold mt-1">Awaiting verification</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Collection Rate</h3>
                            <div className="text-3xl font-black text-blue-600">94.2%</div>
                            <div className="text-gray-400 text-xs font-bold mt-1">System average</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={invoices}
                            pagination
                            highlightOnHover
                            responsive
                            customStyles={{
                                headRow: { style: { backgroundColor: '#f9fafb', borderBottom: '1px solid #f1f5f9' } },
                                headCells: { style: { color: '#64748b', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' } },
                                rows: { style: { fontSize: '0.95rem', minHeight: '72px' } }
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Billing;
