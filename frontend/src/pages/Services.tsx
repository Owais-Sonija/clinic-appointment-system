import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { FaStethoscope } from 'react-icons/fa';

const Services = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axiosInstance.get('/api/clinic/services');
                setServices(res.data?.data || []);
            } catch (error: any) {
                console.error("Error fetching services", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="py-16 md:py-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6 tracking-tight">Our Premium <span className="text-primary block sm:inline mt-2 sm:mt-0">Medical Services</span></h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Comprehensive healthcare solutions designed to prioritize your well-being. Explore our specialized services led by industry experts.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20">
                            {services.map((service) => (
                                <div key={service._id} className="card group hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100 flex flex-col h-full bg-white relative overflow-hidden">
                                    <div className="p-8 flex flex-col h-full relative z-10">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary">
                                            <span className="text-3xl text-primary group-hover:text-white transition duration-300">{service.icon || <FaStethoscope />}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-2xl font-bold text-dark">{service.name}</h3>
                                            <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-tighter">Premium</span>
                                        </div>
                                        <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{service.description}</p>
                                        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Starting at</span>
                                                <span className="text-2xl font-bold text-primary">${service.price}</span>
                                            </div>
                                            <Link to="/contact" className="text-primary font-semibold hover:underline flex items-center gap-1">
                                                Inquire Now <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {services.length === 0 && <p className="col-span-3 text-center text-gray-500 italic py-10">No services available. Please check back later.</p>}

                        {/* FAQ Section */}
                        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-lg border border-gray-50">
                            <h2 className="text-3xl font-bold text-dark mb-10 text-center">Frequently Asked Questions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-dark">Do you accept insurance?</h4>
                                    <p className="text-gray-600">Yes, we work with most major insurance providers. Please contact us to verify your specific plan.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-dark">How do I book an appointment?</h4>
                                    <p className="text-gray-600">You can book directly through our online portal by clicking "Book Appointment" on the home page or via our mobile app.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-dark">What should I bring for my first visit?</h4>
                                    <p className="text-gray-600">Please bring your ID, insurance card, and any relevant medical records or current medications.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-dark">Is emergency care available?</h4>
                                    <p className="text-gray-600">While we handle urgent consultations, for life-threatening emergencies, please call emergency services immediately.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Services;
