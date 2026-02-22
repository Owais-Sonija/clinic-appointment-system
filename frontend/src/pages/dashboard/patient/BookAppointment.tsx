import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaUserMd, FaArrowRight } from 'react-icons/fa';
import LoadingSpinner from '../../../components/LoadingSpinner';

const BookAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const preselectDoctor = location.state?.preselectDoctor || '';

    const [bookingStep, setBookingStep] = useState(1);
    const queryClient = useQueryClient();

    const fetchDoctors = async () => (await axiosInstance.get('/api/doctors')).data?.data || [];
    const fetchServices = async () => (await axiosInstance.get('/api/clinic/services')).data?.data || [];

    const { data: doctors = [], isLoading: docsLoading } = useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors });
    const { data: services = [], isLoading: servsLoading } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

    const loading = docsLoading || servsLoading;

    const [bookingData, setBookingData] = useState({
        doctorId: preselectDoctor,
        serviceId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
    });

    const handleBookingChange = (e: any) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

    const bookMutation = useMutation({
        mutationFn: (newBooking: any) => axiosInstance.post('/api/appointments', newBooking),
        onSuccess: () => {
            toast.success('Appointment booked successfully!');
            setBookingData({ doctorId: '', serviceId: '', appointmentDate: '', appointmentTime: '', notes: '' });
            setBookingStep(1);
            queryClient.invalidateQueries({ queryKey: ['patient-summary'] });
            navigate('/patient/appointments');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to book appointment.');
        }
    });

    const handleBookingSubmit = (e: any) => {
        e.preventDefault();
        const [h, m] = bookingData.appointmentTime.split(':').map(Number);
        const endDate = new Date(0, 0, 0, h, m + 30);
        const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

        const payload = {
            doctorId: bookingData.doctorId,
            serviceId: bookingData.serviceId,
            date: bookingData.appointmentDate,
            startTime: bookingData.appointmentTime,
            endTime,
            notes: bookingData.notes
        };
        bookMutation.mutate(payload);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">Book New Appointment</h1>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto px-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all border-2 z-10 ${bookingStep >= s ? 'bg-primary border-primary text-white shadow-xl shadow-blue-500/30' : 'bg-white border-gray-200 text-gray-400'}`}>
                            {s}
                        </div>
                        <span className={`text-sm mt-3 font-semibold uppercase tracking-wider ${bookingStep >= s ? 'text-primary' : 'text-gray-400'}`}>
                            {s === 1 ? 'Doctor' : s === 2 ? 'Schedule' : 'Review'}
                        </span>
                        {s < 3 && <div className={`absolute left-1/2 top-6 w-full h-0.5 -z-0 ${bookingStep > s ? 'bg-primary' : 'bg-gray-200'}`}></div>}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                {bookingStep === 1 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="bg-blue-50/50 p-6 md:p-8 rounded-2xl border border-blue-100">
                            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                                <FaUserMd className="text-blue-500" /> Select Provider & Service
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="label-text text-blue-900/80 font-semibold mb-2 block">Medical Service</label>
                                    <select name="serviceId" required value={bookingData.serviceId} onChange={handleBookingChange} className="input-field bg-white border-blue-100 focus:border-primary w-full p-4 rounded-xl shadow-sm">
                                        <option value="">-- Choose a Service --</option>
                                        {services.map((s: any) => <option key={s._id} value={s._id}>{s.name} (${s.price})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text text-blue-900/80 font-semibold mb-2 block">Healthcare Professional</label>
                                    <select name="doctorId" required value={bookingData.doctorId} onChange={handleBookingChange} className="input-field bg-white border-blue-100 focus:border-primary w-full p-4 rounded-xl shadow-sm">
                                        <option value="">-- Choose a Doctor --</option>
                                        {doctors.map((d: any) => <option key={d._id} value={d._id}>Dr. {d.userId?.name} - {d.specialization}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            disabled={!bookingData.doctorId || !bookingData.serviceId}
                            onClick={() => setBookingStep(2)}
                            className="btn-primary w-full py-4 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                        >
                            Next: Choose Schedule <FaArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {bookingStep === 2 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="bg-emerald-50/50 p-6 md:p-8 rounded-2xl border border-emerald-100">
                            <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">📅 Select Date & Time</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label-text text-emerald-900/80 font-semibold mb-2 block">Preferred Date</label>
                                    <input type="date" name="appointmentDate" required min={new Date().toISOString().split('T')[0]} value={bookingData.appointmentDate} onChange={handleBookingChange} className="input-field bg-white border-emerald-100 focus:border-emerald-500 w-full p-4 rounded-xl shadow-sm" />
                                </div>
                                <div>
                                    <label className="label-text text-emerald-900/80 font-semibold mb-2 block">Preferred Time</label>
                                    <input type="time" name="appointmentTime" required value={bookingData.appointmentTime} onChange={handleBookingChange} className="input-field bg-white border-emerald-100 focus:border-emerald-500 w-full p-4 rounded-xl shadow-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setBookingStep(1)} className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">Back</button>
                            <button
                                disabled={!bookingData.appointmentDate || !bookingData.appointmentTime}
                                onClick={() => setBookingStep(3)}
                                className="flex-[2] btn-primary py-4 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Review Details
                            </button>
                        </div>
                    </div>
                )}

                {bookingStep === 3 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Final Confirmation</h3>
                            <div className="space-y-6 mb-8 text-lg">
                                <div className="flex flex-col sm:flex-row justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-gray-500 font-medium">Professional:</span>
                                    <span className="font-bold text-dark">Dr. {doctors.find((d: any) => d._id === bookingData.doctorId)?.userId?.name}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-gray-500 font-medium">Service:</span>
                                    <span className="font-bold text-dark">{services.find((s: any) => s._id === bookingData.serviceId)?.name}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                                    <span className="text-blue-800 font-medium">Schedule:</span>
                                    <span className="font-bold text-primary text-xl">
                                        {new Date(bookingData.appointmentDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br />
                                        at {bookingData.appointmentTime}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="label-text font-semibold mb-2 block text-gray-700">Additional Notes (Symptoms, Allergies, etc.)</label>
                                <textarea name="notes" rows={3} value={bookingData.notes} onChange={handleBookingChange} className="input-field bg-white resize-none w-full p-4 rounded-xl shadow-sm border-gray-200" placeholder="Provide any context for the doctor..."></textarea>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setBookingStep(2)} className="flex-1 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">Back</button>
                            <button
                                onClick={handleBookingSubmit}
                                disabled={bookMutation.isPending}
                                className="flex-[2] btn-primary py-4 text-xl font-bold rounded-xl shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
                            >
                                {bookMutation.isPending ? 'Confirming...' : 'Confirm & Book Visit'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;

