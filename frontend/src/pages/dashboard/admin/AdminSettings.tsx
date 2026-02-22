import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsGearFill, BsSaveFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/admin/settings');
        setSettings(res.data.data);
      } catch (err: any) {
        toast.error('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axiosInstance.put('/admin/settings', settings);
      toast.success('System settings globally updated');
    } catch (err: any) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Skeleton count={10} height={40} className="mb-4" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Global System Settings</h1>
          <p className="text-gray-500 mt-2">Configure core operational behaviors for the clinic application.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4 flex items-center">
            <BsGearFill className="mr-2 text-blue-600" /> Operational Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Appointment Duration (Mins)</label>
              <input
                type="number"
                value={settings?.appointmentDuration || ''}
                onChange={(e) => setSettings({ ...settings, appointmentDuration: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cancellation Window (Hours)</label>
              <input
                type="number"
                value={settings?.cancellationWindowHours || ''}
                onChange={(e) => setSettings({ ...settings, cancellationWindowHours: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4 flex items-center">
            <BsGearFill className="mr-2 text-blue-600" /> Clinic Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Start Time (24h)</label>
              <input
                type="time"
                value={settings?.clinicStartTime || ''}
                onChange={(e) => setSettings({ ...settings, clinicStartTime: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic End Time (24h)</label>
              <input
                type="time"
                value={settings?.clinicEndTime || ''}
                onChange={(e) => setSettings({ ...settings, clinicEndTime: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-bold shadow-sm"
            >
              <BsSaveFill />
              <span>{saving ? 'Saving...' : 'Apply Global Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
