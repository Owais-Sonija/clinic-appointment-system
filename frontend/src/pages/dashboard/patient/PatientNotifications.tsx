import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import EmptyState from '../../../components/EmptyState';

const mockNotifications = [
    { id: 1, type: 'reminder', title: 'Upcoming Appointment', message: 'You have an appointment with Dr. Smith tomorrow at 10:00 AM.', date: '2 hours ago', read: false },
    { id: 2, type: 'alert', title: 'Lab Results Ready', message: 'Your recent blood test results are now available in your medical records.', date: '1 day ago', read: true },
    { id: 3, type: 'info', title: 'Clinic Update', message: 'Please note our holiday hours for the upcoming weekend.', date: '3 days ago', read: true },
];

const PatientNotifications = () => {
    const [notifications, setNotifications] = useState(mockNotifications);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'reminder': return <FaExclamationCircle className="text-orange-500" />;
            case 'alert': return <FaCheckCircle className="text-emerald-500" />;
            default: return <FaInfoCircle className="text-blue-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">Stay updated with your appointments and health alerts.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <button onClick={markAllRead} className="text-sm font-bold text-primary hover:text-blue-700 transition">
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <EmptyState
                    title="All Caught Up"
                    description="You don't have any new notifications at the moment."
                    icon="🔔"
                />
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div key={notif.id} className={`flex items-start gap-4 p-5 rounded-2xl border transition hover:shadow-md ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}>
                            <div className="mt-1 text-2xl">{getIcon(notif.type)}</div>
                            <div className="flex-1">
                                <h3 className={`font-bold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h3>
                                <p className={`mt-1 text-sm ${notif.read ? 'text-gray-500' : 'text-gray-700'}`}>{notif.message}</p>
                                <span className="text-xs text-gray-400 mt-2 block font-medium">{notif.date}</span>
                            </div>
                            <button onClick={() => deleteNotification(notif.id)} className="text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-lg hover:bg-red-50" title="Dismiss">
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientNotifications;
