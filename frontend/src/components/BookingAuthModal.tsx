import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaTimes } from 'react-icons/fa';

interface BookingAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctorName?: string;
}

const BookingAuthModal: React.FC<BookingAuthModalProps> = ({ isOpen, onClose, doctorName }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2"
                >
                    <FaTimes size={20} />
                </button>

                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-3xl">
                        🏥
                    </div>
                    <h2 className="text-2xl font-bold text-dark mb-4">Start Your Booking</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        To schedule a session with {doctorName ? `Dr. ${doctorName}` : 'our specialists'}, please sign in to your patient account or create a new one.
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/login', { state: { from: window.location } });
                            }}
                            className="btn-primary py-4 flex items-center justify-center gap-2 group"
                        >
                            <FaSignInAlt className="group-hover:translate-x-1 transition-transform" /> Sign In to Book
                        </button>

                        <div className="flex items-center my-2">
                            <div className="flex-1 h-px bg-gray-100"></div>
                            <span className="px-3 text-xs text-gray-400 font-bold uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        <button
                            onClick={() => {
                                onClose();
                                navigate('/register');
                            }}
                            className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2"
                        >
                            <FaUserPlus /> Register New Account
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-gray-400 italic">
                        By continuing, you agree to our Terms of Service & Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingAuthModal;
