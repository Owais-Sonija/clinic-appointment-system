import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaSave } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorSchedule = () => {
    const queryClient = useQueryClient();
    const [schedule, setSchedule] = useState<any>(null);

    const { isLoading } = useQuery({
        queryKey: ['doctor-schedule'],
        queryFn: async () => {
            const res = await axiosInstance.get('/api/doctor/schedule');
            setSchedule(res.data.data);
            return res.data.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => axiosInstance.put('/api/doctor/schedule', data),
        onSuccess: () => {
            toast.success('Schedule updated successfully');
            queryClient.invalidateQueries({ queryKey: ['doctor-schedule'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    });

    if (isLoading || !schedule) return <LoadingSpinner />;

    const toggleDay = (day: string) => {
        const workingDays = schedule.workingDays.includes(day)
            ? schedule.workingDays.filter((d: string) => d !== day)
            : [...schedule.workingDays, day];
        setSchedule({ ...schedule, workingDays });
    };

    const handleSave = () => {
        updateMutation.mutate(schedule);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Availability Schedule</h1>
                <p className="text-gray-500 font-medium">Set your working days and consultation hours</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" /> Working Days
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {DAYS.map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${schedule.workingDays.includes(day)
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaClock className="text-primary" /> Working Hours
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Time</label>
                            <input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Time</label>
                            <input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slot Duration (Minutes)</label>
                            <select
                                value={schedule.slotDuration}
                                onChange={(e) => setSchedule({ ...schedule, slotDuration: parseInt(e.target.value) })}
                                className="w-full p-3 bg-gray-50 border-none rounded-xl font-bold text-gray-900 focus:ring-2 focus:ring-primary"
                            >
                                <option value={15}>15 Minutes</option>
                                <option value={30}>30 Minutes</option>
                                <option value={45}>45 Minutes</option>
                                <option value={60}>60 Minutes</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-blue-600">
                    <FaCheckCircle className="text-xl" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900">Availability Sync</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        Changes to your schedule will instantly update the patient booking page.
                        Past appointments will not be affected. To block specific dates (e.g., vacation),
                        use the Holiday Calendar below.
                    </p>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    <FaSave /> {updateMutation.isPending ? 'Saving...' : 'Save Schedule'}
                </button>
            </div>
        </div>
    );
};

export default DoctorSchedule;
