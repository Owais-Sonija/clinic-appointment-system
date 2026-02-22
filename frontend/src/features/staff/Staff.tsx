import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import DataTable from 'react-data-table-component';
import { BsPersonBadgeFill, BsBriefcaseFill, BsClockFill, BsShieldCheck } from 'react-icons/bs';

const fetchStaff = async () => (await axiosInstance.get('/api/staff')).data?.data || [];

export const Staff = () => {
    const { data: staff = [], isLoading } = useQuery({ queryKey: ['staff-list'], queryFn: fetchStaff });

    const columns = [
        {
            name: 'Staff Member',
            selector: (row: any) => row.userId?.name,
            sortable: true,
            cell: (row: any) => (
                <div className="flex items-center gap-3 py-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white uppercase">
                        {row.userId?.name?.[0] || 'S'}
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{row.userId?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-tighter font-bold">{row.designation || 'Staff'}</div>
                    </div>
                </div>
            )
        },
        {
            name: 'Department',
            selector: (row: any) => row.department,
            sortable: true,
            cell: (row: any) => <span className="text-sm font-medium text-gray-600">{row.department}</span>
        },
        {
            name: 'Shift',
            selector: (row: any) => row.shiftStartTime,
            cell: (row: any) => (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <BsClockFill className="text-blue-400" />
                    {row.shiftStartTime} - {row.shiftEndTime}
                </div>
            )
        },
        {
            name: 'Employment',
            selector: (row: any) => row.employmentStatus,
            sortable: true,
            cell: (row: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.employmentStatus === 'Permanent' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                    {row.employmentStatus || 'Full-time'}
                </span>
            )
        },
        {
            name: 'Access',
            cell: (row: any) => (
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                    <BsShieldCheck /> {row.userId?.role?.toUpperCase()}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Staff & HR Directory</h2>
                    <p className="text-gray-500 font-medium">Manage clinic employees, roles, departments, and work shifts.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all">
                    Register New Staff
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Staff', value: staff.length, icon: <BsPersonBadgeFill />, color: 'blue' },
                    { label: 'Doctors', value: staff.filter((s: any) => s.userId?.role === 'doctor').length || '-', icon: <BsBriefcaseFill />, color: 'indigo' },
                    { label: 'Nurses', value: staff.filter((s: any) => s.userId?.role === 'nurse').length || '-', icon: <BsPersonBadgeFill />, color: 'emerald' },
                    { label: 'On Shift', value: staff.length > 0 ? staff.length : 0, icon: <BsClockFill />, color: 'amber' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center text-xl mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <h4 className="text-3xl font-black text-gray-800 mt-1">{stat.value}</h4>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={staff}
                    progressPending={isLoading}
                    pagination
                    highlightOnHover
                    responsive
                    customStyles={{
                        headRow: { style: { backgroundColor: '#f9fafb', borderBottom: '1px solid #f1f5f9' } },
                        headCells: { style: { color: '#64748b', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase' } }
                    }}
                />
            </div>
        </div>
    );
};
