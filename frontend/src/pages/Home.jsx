import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaCalendarCheck, FaHeartbeat, FaArrowRight } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchPreviews = async () => {
            try {
                const [docRes, servRes] = await Promise.all([
                    axiosInstance.get('/api/doctors'),
                    axiosInstance.get('/api/services')
                ]);
                setDoctors(docRes.data?.data?.slice(0, 3) || []); // Top 3 doctors
                setServices(servRes.data?.data?.slice(0, 4) || []); // Top 4 services
            } catch (error) {
                console.error("Error fetching preview data", error);
            }
        };
        fetchPreviews();
    }, []);

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative bg-dark text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-32 md:pt-32 md:pb-40">
                    <div className="max-w-2xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary font-semibold text-sm mb-6 border border-primary/30">
                            Your Health, Our Priority
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                            Premium Healthcare <span className="text-primary block mt-2">Made Accessible.</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                            Book appointments with specialized doctors in minutes. Experience world-class medical consultation with our certified professionals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 group text-lg py-4">
                                Book an Appointment <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/services" className="btn-outline flex items-center justify-center border-gray-500 text-white hover:bg-gray-800 text-lg py-4">
                                Explore Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features/Stats Section */}
            <section className="py-12 bg-white border-b border-gray-100 relative -mt-16 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4 transform hover:-translate-y-2 transition duration-300">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaUserMd className="text-primary text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-dark mb-2">Expert Doctors</h3>
                                <p className="text-gray-600">Our team consists of highly qualified and experienced medical professionals.</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4 transform hover:-translate-y-2 transition duration-300">
                            <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaCalendarCheck className="text-secondary text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-dark mb-2">Easy Booking</h3>
                                <p className="text-gray-600">Schedule appointments online instantly without any waiting time.</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4 transform hover:-translate-y-2 transition duration-300">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <FaHeartbeat className="text-red-500 text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-dark mb-2">Quality Care</h3>
                                <p className="text-gray-600">We provide state-of-the-art facilities and compassionate care to all patients.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Our Premium Services</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">We offer a wide range of medical services tailored to your individual health needs.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service) => (
                            <div key={service._id} className="card p-6 text-left group">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary transition duration-300">
                                    <span className="text-2xl text-primary group-hover:text-white transition duration-300">{service.icon || '🩺'}</span>
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-3">{service.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <span className="font-bold text-primary">${service.price}</span>
                                    <Link to="/services" className="text-sm text-primary font-medium hover:underline">Learn more</Link>
                                </div>
                            </div>
                        ))}
                        {services.length === 0 && <p className="col-span-4 text-gray-500 italic">No services available yet.</p>}
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/services" className="btn-outline inline-block">View All Services</Link>
                    </div>
                </div>
            </section>

            {/* Doctors Preview */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Meet Our Specialists</h2>
                            <p className="text-gray-600 max-w-2xl text-lg">Book a consultation with our top-rated medical experts.</p>
                        </div>
                        <Link to="/doctors" className="hidden md:flex btn-outline items-center gap-2 group">
                            See All Doctors <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="card flex flex-col items-center p-8 text-center border-t-4 border-t-primary">
                                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-gray-50 shadow-inner">
                                    <img
                                        src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.userId?.name}&background=random`}
                                        alt={doctor.userId?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-1">Dr. {doctor.userId?.name}</h3>
                                <p className="text-primary font-medium mb-4">{doctor.specialization}</p>
                                <div className="bg-gray-50 w-full py-3 rounded-lg flex justify-between px-6 mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Experience</p>
                                        <p className="font-bold text-dark">{doctor.experience} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Consult Fee</p>
                                        <p className="font-bold text-dark">${doctor.consultationFee}</p>
                                    </div>
                                </div>
                                <Link to={`/doctors/${doctor._id}`} className="w-full btn-outline">View Profile</Link>
                            </div>
                        ))}
                        {doctors.length === 0 && <p className="col-span-3 text-gray-500 text-center italic mt-10">No doctors registered yet.</p>}
                    </div>

                    <div className="mt-10 text-center md:hidden">
                        <Link to="/doctors" className="btn-outline inline-flex items-center gap-2 group">
                            See All Doctors <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
