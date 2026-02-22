import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsMegaphoneFill, BsSendFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

const AdminNotifications: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: 'all'
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.warning('Please complete all fileds.');
      return;
    }

    try {
      setSending(true);
      const res = await axiosInstance.post('/admin/notifications/broadcast', formData);
      toast.success(`Broadcast sent to ${res.data.data.count} users successfully!`);
      setFormData({ title: '', message: '', targetRole: 'all' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Broadcast Notifications</h1>
          <p className="text-gray-500 mt-2">Send urgent alerts or mass communications to specific user roles.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            <BsMegaphoneFill size={32} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Audience</label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="all">Everyone in Clinic System</option>
              <option value="patient">All Patients Only</option>
              <option value="doctor">All Doctors Only</option>
              <option value="nurse">All Nurses Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Title</label>
            <input
              type="text"
              placeholder="e.g., Important System Maintenance Notice"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
            <textarea
              rows={5}
              placeholder="Enter the details of the broadcast here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white ${sending ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} transition-all duration-300`}
          >
            <BsSendFill className="mr-3" />
            {sending ? 'Broadcasting...' : 'Dispatch Broadcast'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
