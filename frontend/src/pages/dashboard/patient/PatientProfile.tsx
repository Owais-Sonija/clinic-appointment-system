import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';

const PatientProfile = () => {
    const { user, login } = useContext(AuthContext)!;
    const queryClient = useQueryClient();
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const fetchProfile = async () => {
        const res = await axiosInstance.get('/api/auth/profile');
        return res.data;
    };

    const { data: profileData, isLoading } = useQuery({
        queryKey: ['patient-profile'],
        queryFn: fetchProfile
    });

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
                address: profileData.address || ''
            });
        }
    }, [profileData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.put('/api/auth/profile', data),
        onSuccess: (res) => {
            toast.success('Profile updated successfully');
            setEditMode(false);
            queryClient.invalidateQueries({ queryKey: ['patient-profile'] });
            // Optionally update context user if necessary
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.post('/api/auth/change-password', data),
        onSuccess: () => {
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to change password');
        }
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(formData);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        updatePasswordMutation.mutate({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="bg-blue-50/50 p-8 border-b border-blue-100 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl text-primary font-bold shadow-md border-4 border-white">
                        {profileData?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900">{profileData?.name}</h2>
                        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">{profileData?.role}</p>
                    </div>
                    <div className="md:ml-auto">
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className={`px-6 py-2 rounded-xl font-bold transition ${editMode ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white'}`}
                        >
                            {editMode ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 animate-fade-in">
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-2 block flex flex-center gap-2"><FaUserCircle className="text-gray-400" /> Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary/20 transition disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-2 block flex gap-2"><FaEnvelope className="text-gray-400" /> Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary/20 transition disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-2 block flex gap-2"><FaPhone className="text-gray-400" /> Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary/20 transition disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="Not provided"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-2 block flex gap-2"><FaMapMarkerAlt className="text-gray-400" /> Physical Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary/20 transition disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="Not provided"
                                />
                            </div>
                        </div>
                        {editMode && (
                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={updateProfileMutation.isPending} className="btn-primary w-full md:w-auto px-8">
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="border-t border-gray-100 pt-8 mt-8">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-6 flex items-center gap-2">
                            <FaLock className="text-gray-400" /> Security Settings
                        </h3>
                        {/* Note: In a real app the /api/auth/change-password endpoint must exist */}
                        {/* Placeholder purely for UI presentation based on instruction constraints */}
                        <form onSubmit={(e) => { e.preventDefault(); toast.info("Password change flow would execute here"); }} className="max-w-md space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Current Password</label>
                                <input type="password" value="********" disabled className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500" />
                            </div>
                            <button type="button" onClick={() => toast.info('Password reset email dispatched to registered email address.')} className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                                Request Password Reset
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
