import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import DataTable from 'react-data-table-component';
import { BsSearch, BsPersonPlus, BsThreeDotsVertical, BsEyeFill, BsPencilFill } from 'react-icons/bs';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const fetchPatients = async () => {
    const res = await axiosInstance.get('/api/users?role=patient');
    return res.data?.data || [];
};

export const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [simulatedLoading, setSimulatedLoading] = useState(true); // New state for simulated initial load

    const { data: patients = [], isLoading: queryLoading } = useQuery({
        queryKey: ['patients-list'],
        queryFn: fetchPatients
    });

    // Simulate initial load for ERP premium feel
    useEffect(() => {
        const timer = setTimeout(() => setSimulatedLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const isLoading = queryLoading || simulatedLoading; // Combine query loading with simulated loading

    const filteredPatients = patients.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.phone && p.phone.includes(searchTerm))
    );

    const columns = [
        {
            name: 'Patient',
            selector: (row: any) => row.name,
            sortable: true,
            cell: (row: any) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white uppercase shadow-sm">
                        {row.name[0]}
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            name: 'Gender/DOB',
            selector: (row: any) => row.gender || 'N/A',
            sortable: true,
            cell: (row: any) => (
                <div className="text-sm">
                    <div className="text-gray-700 font-medium">{row.gender || 'Not set'}</div>
                    <div className="text-xs text-gray-500">{row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : 'No DOB'}</div>
                </div>
            )
        },
        { name: 'Phone', selector: (row: any) => row.phone || 'N/A', sortable: true },
        {
            name: 'Status',
            selector: (row: any) => row.isActive,
            sortable: true,
            cell: (row: any) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            name: 'Actions',
            cell: (row: any) => (
                <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Profile">
                        <BsEyeFill />
                    </button>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit">
                        <BsPencilFill />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition">
                        <BsThreeDotsVertical />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Directory</h2>
                    <p className="text-gray-500 font-medium">Manage and view all registered patients in the system.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95">
                    <BsPersonPlus className="text-xl" />
                    <span>Add New Patient</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-2">
                    {isLoading ? (
                        <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
                            <div className="p-4">
                                <Skeleton height={40} className="mb-4" />
                                <Skeleton count={5} height={60} className="mb-2" />
                            </div>
                        </SkeletonTheme>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredPatients}
                            pagination
                            highlightOnHover
                            pointerOnHover
                            responsive
                            customStyles={{
                                header: { style: { display: 'none' } },
                                headRow: { style: { backgroundColor: '#f9fafb', borderTop: 'none', borderBottom: '1px solid #f1f5f9' } },
                                headCells: { style: { color: '#64748b', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' } },
                                rows: { style: { borderBottom: '1px solid #f8fafc', '&:hover': { backgroundColor: '#f1f5f9' } } }
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
