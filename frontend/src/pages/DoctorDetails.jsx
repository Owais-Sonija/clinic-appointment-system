import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaClock, FaCalendarPlus, FaArrowLeft } from 'react-icons/fa';

const DoctorDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await axiosInstance.get(`/api/doctors/${id}`);
                setDoctor(res.data?.data);
            } catch (error) {
                console.error("Error fetching doctor details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center py-32 bg-gray-50 min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!doctor) return <div className="text-center py-32 text-xl text-gray-600 bg-gray-50 min-h-screen">Doctor not found.</div>;

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/doctors" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition mb-8 font-medium">
                    <FaArrowLeft /> Back to Doctors
                </Link>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gradient-to-b from-blue-50 to-white p-8 border-r border-gray-100 flex flex-col items-center text-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-lg mb-6">
                            <img
                                src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.userId?.name}&background=random`}
                                alt={doctor.userId?.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-dark mb-2">Dr. {doctor.userId?.name}</h1>
                        <p className="text-primary font-bold tracking-wide bg-blue-100/50 px-4 py-1.5 rounded-full text-sm inline-block mb-6">{doctor.specialization}</p>

                        {user ? (
                            <Link to={`/patient`} state={{ preselectDoctor: doctor._id }} className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-lg mt-auto">
                                <FaCalendarPlus /> Book Session
                            </Link>
                        ) : (
                            <Link to="/login" className="w-full btn-outline flex items-center justify-center gap-2 py-3 mt-auto">
                                Login to Book
                            </Link>
                        )}
                    </div>

                    <div className="md:w-2/3 p-8 lg:p-12">
                        <h2 className="text-2xl font-bold text-dark mb-6 border-b border-gray-100 pb-4">Professional Profile</h2>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                            <p className="text-gray-600 leading-relaxed">{doctor.bio || "No detailed biography provided for this specialist."}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaGraduationCap className="text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Qualification</h4>
                                    <p className="font-bold text-dark text-lg">{doctor.qualification}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaBriefcase className="text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Experience</h4>
                                    <p className="font-bold text-dark text-lg">{doctor.experience} Years</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                                    <FaMoneyBillWave className="text-xl" />
                                </div>
                                <div>
                                    <h4 className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Consultation Fee</h4>
                                    <p className="font-bold text-dark text-lg">${doctor.consultationFee}</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2"><FaClock className="text-primary" /> Regular Availability</h2>
                        {doctor.availability && doctor.availability.length > 0 ? (
                            <div className="bg-white border text-center border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200 text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Day</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Time Window</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {doctor.availability.map((slot, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-dark text-left">{slot.day}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-right">{slot.startTime} - {slot.endTime}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">Schedule not published. Please select a date to check availability.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
