import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axiosInstance.post('/api/contact', formData);
            toast.success('Your message has been sent successfully. We will get back to you soon!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-16 md:py-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6 tracking-tight">Get in <span className="text-primary">Touch</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Have questions about our services or want to leave feedback? Our support team is here to assist you 24/7.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="lg:w-2/5 bg-dark p-10 lg:p-14 text-white flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-bl-full opacity-20 -z-0 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary rounded-tr-full opacity-10 -z-0 blur-2xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                            <p className="text-gray-300 mb-12 leading-relaxed">
                                Fill up the form and our team will get back to you within 24 hours. Connect with us directly via phone or email for urgent medical matters.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Phone</h4>
                                        <p className="text-lg font-medium">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Email</h4>
                                        <p className="text-lg font-medium">info@mediclinic.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-1">Location</h4>
                                        <p className="text-lg font-medium">123 Medical Drive<br />Health City, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-3/5 p-10 lg:p-14 flex flex-col justify-center">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label-text">Your Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="label-text">Email Address</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="label-text">Subject</label>
                                <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className="input-field" placeholder="How can we help you?" />
                            </div>
                            <div>
                                <label className="label-text">Message</label>
                                <textarea name="message" required rows="5" value={formData.message} onChange={handleChange} className="input-field resize-none py-4" placeholder="Type your message here..."></textarea>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2">
                                {isSubmitting ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
