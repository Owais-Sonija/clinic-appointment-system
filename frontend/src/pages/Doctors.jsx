import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpec, setFilterSpec] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axiosInstance.get('/api/doctors');
                setDoctors(res.data?.data || []);
            } catch (error) {
                console.error("Error fetching doctors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterSpec === '' || doc.specialization === filterSpec;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="py-16 md:py-24 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4 tracking-tight">Our Specialists</h1>
                        <p className="text-lg text-gray-600 max-w-xl">Find and book appointments with our world-class medical professionals across various specializations.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search doctors..."
                                className="input-field pl-10 w-full shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        <select
                            className="input-field shadow-sm w-full sm:w-48 appearance-none bg-white font-medium text-gray-600"
                            value={filterSpec}
                            onChange={(e) => setFilterSpec(e.target.value)}
                        >
                            <option value="">All Specialties</option>
                            {specializations.map((spec, i) => (
                                <option key={i} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doctor) => (
                            <div key={doctor._id} className="card p-0 flex flex-col hover:-translate-y-2 transition-all duration-300">
                                <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 w-full relative">
                                    <div className="absolute -bottom-16 w-full flex justify-center">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                                            <img
                                                src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.userId?.name}&background=random`}
                                                alt={doctor.userId?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-20 px-8 pb-8 flex flex-col items-center flex-grow text-center">
                                    <h3 className="text-2xl font-bold text-dark mb-1">Dr. {doctor.userId?.name}</h3>
                                    <p className="text-primary font-medium tracking-wide bg-blue-50 px-3 py-1 rounded-full text-sm inline-block mb-4">{doctor.specialization}</p>

                                    <div className="w-full flex justify-between border-t border-b border-gray-100 py-4 my-4">
                                        <div className="text-center">
                                            <p className="text-dark font-bold text-lg">{doctor.experience}+</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Years Exp.</p>
                                        </div>
                                        <div className="w-px bg-gray-200"></div>
                                        <div className="text-center">
                                            <p className="text-dark font-bold text-lg">${doctor.consultationFee}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Consult Fee</p>
                                        </div>
                                    </div>

                                    <Link to={`/doctors/${doctor._id}`} className="w-full btn-outline group flex items-center justify-center gap-2 mt-auto py-3">
                                        View Full Profile <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {filteredDoctors.length === 0 && <p className="col-span-full text-center py-12 text-gray-500 text-lg">No doctors found matching your criteria.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;
