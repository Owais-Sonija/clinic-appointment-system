import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaStethoscope, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)!;

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin';
        if (user.role === 'doctor') return '/doctor';
        return '/patient';
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <FaStethoscope className="text-primary text-3xl group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-bold text-2xl text-dark tracking-tight">Medi<span className="text-primary">Clinic</span></span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium transition">Home</Link>
                        <Link to="/services" className="text-gray-600 hover:text-primary font-medium transition">Services</Link>
                        <Link to="/doctors" className="text-gray-600 hover:text-primary font-medium transition">Our Doctors</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-primary font-medium transition">Contact</Link>

                        {user ? (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                                <Link to={getDashboardLink()} className="flex items-center gap-2 text-dark font-medium hover:text-primary transition group">
                                    <FaUserCircle className="text-xl group-hover:scale-110 transition-transform" />
                                    {user.name}
                                </Link>
                                <button onClick={logout} className="btn-outline py-1.5 px-4 text-sm">Logout</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                                <Link to="/login" className="text-gray-600 font-medium hover:text-primary transition">Log in</Link>
                                <Link to="/register" className="btn-primary py-2 shadow-blue-500/30 shadow-lg text-sm">Book Appointment</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
