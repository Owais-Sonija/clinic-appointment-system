import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserMd, FaIdCard, FaGraduationCap, FaStethoscope, FaSave, FaUserCircle } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';

const DoctorProfile = () => {
    const { user } = useContext(AuthContext)!;
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<any>(null);

    const { isLoading } = useQuery({
        queryKey: ['doctor-profile'],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/auth/profile');
            const profile = res.data.data;
            setFormData({
                name: profile.name,
                specialization: profile.doctorProfile?.specialization || '',
                experience: profile.doctorProfile?.experience || 0,
                qualification: profile.doctorProfile?.qualification || '',
                bio: profile.doctorProfile?.bio || '',
                consultationFee: profile.doctorProfile?.consultationFee || 0,
            });
            return profile;
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.put('/api/doctors/profile/update', data),
        onSuccess: () => {
            toast.success('Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ['doctor-profile'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    });

    if (isLoading || !formData) return <LoadingSpinner />;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Professional Profile</h1>
                <p className="text-gray-500 font-medium">Manage your public information and clinical details</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Avatar/Basic */}
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center text-primary text-6xl border-4 border-white shadow-lg overflow-hidden relative group">
                            <FaUserCircle className="opacity-80" />
                            <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold uppercase tracking-widest">
                                Change
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{formData.name}</h3>
                            <p className="text-sm font-bold text-primary uppercase tracking-wider">{formData.specialization || 'General Physician'}</p>
                        </div>
                    </div>

                    {/* Right: Form fields */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                <div className="relative">
                                    <FaUserMd className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</label>
                                <div className="relative">
                                    <FaStethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="w-full pl-10 p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qualification</label>
                                <div className="relative">
                                    <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className="w-full pl-10 p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Fee ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input type="number" value={formData.consultationFee} onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) })} className="w-full pl-10 p-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary text-sm font-bold" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Bio</label>
                            <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary text-sm font-medium resize-none shadow-inner" placeholder="Tell patients about your clinical experience and approach..."></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={updateMutation.isPending} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                                <FaSave /> {updateMutation.isPending ? 'Saving...' : 'Save Professional Profile'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DoctorProfile;
