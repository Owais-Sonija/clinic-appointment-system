import React from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4 group inline-flex">
                            <FaStethoscope className="text-primary text-3xl group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-2xl tracking-tight">Medi<span className="text-primary">Clinic</span></span>
                        </Link>
                        <p className="text-gray-400 mt-4 max-w-md leading-relaxed">
                            Providing premium healthcare services with world-class facilities and specialized doctors. Your health is our top priority.
                        </p>
                        <div className="flex space-x-4 mt-8">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition duration-300 shadow-lg"><FaFacebook /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition duration-300 shadow-lg"><FaTwitter /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition duration-300 shadow-lg"><FaInstagram /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white tracking-wide border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> About Us</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Our Services</Link></li>
                            <li><Link to="/doctors" className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Find a Doctor</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary transition flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white tracking-wide border-b border-gray-700 pb-2 inline-block">Contact Info</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start">
                                <span className="text-primary mr-3 mt-1">📍</span>
                                <span>123 Medical Drive<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-primary mr-3">📞</span>
                                <span>(555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-primary mr-3">✉️</span>
                                <span>info@mediclinic.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} MediClinic. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 space-x-4">
                        <Link to="#" className="hover:text-primary transition">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary transition">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
