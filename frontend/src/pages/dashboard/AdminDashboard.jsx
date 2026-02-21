import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-dark mb-2 border-b pb-4">Admin Control Panel</h1>
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 mt-8">
                    <h2 className="text-2xl font-bold mb-4">Welcome, Super Admin {user.name}</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed">
                        This is the system administrative panel. You have full access to manage the healthcare ecosystem. In a fully populated production application, you will see comprehensive CRUD elements here.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="border border-gray-200 p-6 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition">
                            <div className="bg-blue-50 w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-primary text-xl font-bold">D</div>
                            <h3 className="font-bold text-lg mb-1">Manage Doctors</h3>
                            <p className="text-sm text-gray-500">Add, edit, and remove medical staff.</p>
                        </div>
                        <div className="border border-gray-200 p-6 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition">
                            <div className="bg-yellow-50 w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-secondary text-xl font-bold">S</div>
                            <h3 className="font-bold text-lg mb-1">Manage Services</h3>
                            <p className="text-sm text-gray-500">Configure clinic offerings and pricing.</p>
                        </div>
                        <Link to="/doctor" className="border border-gray-200 p-6 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition block">
                            <div className="bg-green-50 w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-green-600 text-xl font-bold">A</div>
                            <h3 className="font-bold text-lg mb-1">All Appointments</h3>
                            <p className="text-sm text-gray-500">System-wide schedule override.</p>
                        </Link>
                        <div className="border border-gray-200 p-6 rounded-xl hover:border-primary cursor-pointer hover:shadow-md transition">
                            <div className="bg-red-50 w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-red-500 text-xl font-bold">M</div>
                            <h3 className="font-bold text-lg mb-1">Patient Messages</h3>
                            <p className="text-sm text-gray-500">Respond to public contact inquiries.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
