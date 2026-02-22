import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaStethoscope } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { register, user } = useContext(AuthContext)!;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/patient'); // Default redirect for new registers
        }
    }, [user, navigate]);

    const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });
            toast.success('Registration successful! Welcome to MediClinic.');
            navigate('/patient');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="flex flex-col items-start gap-4 mb-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <FaStethoscope className="text-primary text-3xl group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-2xl text-dark tracking-tight">Medi<span className="text-primary">Clinic</span></span>
                        </Link>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900 font-display">Join as a New Patient</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-blue-700">
                                Log in here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label-text text-gray-700 font-semibold mb-1.5 block">Full Name</label>
                                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="input-field shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="John Doe" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label-text text-gray-700 font-semibold mb-1.5 block">Email Address</label>
                                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="input-field shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="label-text text-gray-700 font-semibold mb-1.5 block">Phone Number</label>
                                    <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="input-field shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="+1 234 567 890" />
                                </div>
                            </div>

                            <div>
                                <label className="label-text text-gray-700 font-semibold mb-1.5 block">Password</label>
                                <input name="password" type="parent" required value={formData.password} onChange={handleChange} className="input-field shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="Minimum 6 characters" minLength={6} />
                            </div>

                            <div>
                                <label className="label-text text-gray-700 font-semibold mb-1.5 block">Confirm Password</label>
                                <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="input-field shadow-sm focus:ring-2 focus:ring-primary/20" placeholder="Repeat your password" />
                            </div>

                            <div className="pt-4">
                                <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-4 text-lg font-bold shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creating Account...
                                        </>
                                    ) : 'Create Patient Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative w-0 flex-1">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Medical professional smiling"
                />
                <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
            </div>
        </div>
    );
};

export default Register;
