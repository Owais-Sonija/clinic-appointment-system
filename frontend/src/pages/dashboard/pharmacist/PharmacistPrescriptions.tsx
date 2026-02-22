import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCapsule, BsExclamationTriangleFill, BsEyeFill, BsCheckCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

const PharmacistPrescriptions: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('Pending');

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/api/pharmacist/prescriptions?status=${statusFilter}`);
            setPrescriptions(res.data.data);
        } catch (error) {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, [statusFilter]);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            'Pending': 'bg-amber-100 text-amber-700',
            'Partially Dispensed': 'bg-blue-100 text-blue-700',
            'Completed': 'bg-emerald-100 text-emerald-700'
        };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <BsCapsule className="mr-3 text-indigo-600" />
                        Prescription Queue
                    </h1>
                    <p className="text-gray-500 mt-2">Fulfill active prescriptions and verify stock availability.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['Pending', 'Partially Dispensed', 'Completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${statusFilter === status ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {status === 'Partially Dispensed' ? 'Partial' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Prescription Date</th>
                                <th className="px-6 py-4">Patient Details</th>
                                <th className="px-6 py-4">Prescribing Doctor</th>
                                <th className="px-6 py-4">Items Count</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton width={100} /></td>
                                        <td className="px-6 py-4"><Skeleton width={130} /></td>
                                        <td className="px-6 py-4"><Skeleton width={120} /></td>
                                        <td className="px-6 py-4"><Skeleton width={60} /></td>
                                        <td className="px-6 py-4"><Skeleton width={80} /></td>
                                        <td className="px-6 py-4"><Skeleton width={80} /></td>
                                    </tr>
                                ))
                            ) : prescriptions.length > 0 ? (
                                prescriptions.map((prec: any) => (
                                    <tr key={prec._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800 text-xs">
                                            {new Date(prec.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800">{prec.patientId?.name || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500">{prec.patientId?.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            Dr. {prec.doctorId?.userId?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {prec.items?.length || 0} Medications
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={prec.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                to={`/pharmacist/prescriptions/${prec._id}`}
                                                className="inline-flex items-center justify-center p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition space-x-1"
                                                title={prec.status === 'Completed' ? 'View Details' : 'Verify & Dispense'}
                                            >
                                                {prec.status === 'Completed' ? <BsEyeFill /> : <BsCheckCircleFill />}
                                                <span className="text-xs font-bold ml-1">{prec.status === 'Completed' ? 'View' : 'Fulfill'}</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        <BsCheckCircleFill className="mx-auto text-4xl text-emerald-300 mb-3" />
                                        No prescriptions found matching the primary filter ({statusFilter}).
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

export default PharmacistPrescriptions;
