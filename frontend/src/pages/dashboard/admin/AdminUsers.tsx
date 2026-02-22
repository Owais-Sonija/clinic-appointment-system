import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsPeopleFill, BsSearch, BsShieldLockFill, BsPersonCheckFill, BsToggleOn, BsToggleOff } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const query = roleFilter === 'all' ? '' : `?role=${roleFilter}`;
            // If the query has search text, append it
            const searchParam = search ? (query ? `&search=${search}` : `?search=${search}`) : '';
            const res = await axiosInstance.get(`/api/admin/users${query}${searchParam}`);
            setUsers(res.data.data);
        } catch (error) {
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce search
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [roleFilter, search]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!window.confirm(`Are you sure you want to grant ${newRole} privileges to this user?`)) return;
        try {
            await axiosInstance.put(`/api/admin/users/${userId}/role`, { role: newRole });
            toast.success(`User role effectively updated to ${newRole}`);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update user role');
        }
    };

    const RoleBadge = ({ role }: { role: string }) => {
        const styles: any = {
            'admin': 'bg-purple-100 text-purple-700',
            'doctor': 'bg-indigo-100 text-indigo-700',
            'nurse': 'bg-pink-100 text-pink-700',
            'receptionist': 'bg-amber-100 text-amber-700',
            'pharmacist': 'bg-emerald-100 text-emerald-700',
            'patient': 'bg-gray-100 text-gray-700'
        };
        return <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${styles[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 flex items-center">
                        <BsPeopleFill className="mr-3 text-indigo-600" />
                        Global User Directory
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">Manage platform access, roles, and administrative standing.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {['all', 'admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'patient'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition uppercase ${roleFilter === r ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search accounts by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-white text-gray-400 uppercase font-black tracking-wider text-[10px] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Account Holder</th>
                                <th className="px-6 py-4">Contact Detail</th>
                                <th className="px-6 py-4">Assigned Role</th>
                                <th className="px-6 py-4 text-center">Platform Status</th>
                                <th className="px-6 py-4 text-center">Modify Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton width={150} /></td>
                                        <td className="px-6 py-4"><Skeleton width={120} /></td>
                                        <td className="px-6 py-4"><Skeleton width={80} /></td>
                                        <td className="px-6 py-4"><Skeleton width={60} /></td>
                                        <td className="px-6 py-4"><Skeleton width={100} /></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-gray-50/80 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg hidden sm:flex">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">ID: {user._id.substr(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-700">{user.email}</p>
                                            <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.isActive ? (
                                                <span className="flex items-center justify-center text-emerald-600 font-bold text-xs"><BsToggleOn className="mr-1 text-lg" /> ACTIVE</span>
                                            ) : (
                                                <span className="flex items-center justify-center text-red-500 font-bold text-xs"><BsToggleOff className="mr-1 text-lg" /> DISABLED</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <select
                                                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 font-bold cursor-pointer outline-none"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="doctor">Doctor</option>
                                                <option value="nurse">Nurse</option>
                                                <option value="receptionist">Receptionist</option>
                                                <option value="pharmacist">Pharmacist</option>
                                                <option value="patient">Patient</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No users found matching the search criteria.
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

export default AdminUsers;
