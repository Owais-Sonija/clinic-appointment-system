import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsGearFill, BsClockFill, BsCalendarXFill, BsCheckCircleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/admin/settings');

            // Set defaults if missing
            const data = res.data.data || {};
            setSettings({
                appointmentDuration: data.appointmentDuration || 30,
                cancellationWindowHours: data.cancellationWindowHours || 24,
                clinicStartTime: data.clinicStartTime || '09:00',
                clinicEndTime: data.clinicEndTime || '17:00'
            });
        } catch (error) {
            toast.error('Failed to load clinic settings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await axiosInstance.put('/api/admin/settings', settings);
            toast.success('Clinic settings successfully updated and broadcast to the system');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'number' ? Number(value) : value
        });
    };

    if (loading) return <div className="p-6 max-w-4xl mx-auto"><Skeleton height={400} /></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-800 flex items-center">
                    <BsGearFill className="mr-3 text-indigo-600" />
                    System Settings
                </h1>
                <p className="text-gray-500 font-medium mt-1">Configure global operational parameters affecting all clinic staff and patients.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center">
                        <BsClockFill className="mr-2 text-indigo-500" /> Scheduling & Time Parameters
                    </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Default Appointment Duration (Minutes)</label>
                        <input
                            type="number"
                            name="appointmentDuration"
                            min="5"
                            step="5"
                            value={settings.appointmentDuration}
                            onChange={handleChange}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 font-medium outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-2">Determines timeslot generation for doctor availability.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <BsCalendarXFill className="mr-1 text-red-400" /> Cancellation Window (Hours)
                        </label>
                        <input
                            type="number"
                            name="cancellationWindowHours"
                            min="1"
                            value={settings.cancellationWindowHours}
                            onChange={handleChange}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-red-300 focus:border-red-400 block w-full p-3 font-medium outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-2">Hours before appointment where cancellation is restricted.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Clinic Start Time (24H Format)</label>
                        <input
                            type="time"
                            name="clinicStartTime"
                            value={settings.clinicStartTime}
                            onChange={handleChange}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 font-medium outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Clinic End Time (24H Format)</label>
                        <input
                            type="time"
                            name="clinicEndTime"
                            value={settings.clinicEndTime}
                            onChange={handleChange}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 font-medium outline-none"
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition flex items-center disabled:opacity-50 shadow-sm"
                    >
                        {saving ? 'Synchronizing...' : <><BsCheckCircleFill className="mr-2" /> Save & Broadcast Settings</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
