import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    BsGrid1X2Fill,
    BsPeopleFill,
    BsCalendarCheckFill,
    BsFileEarmarkMedicalFill,
    BsInboxesFill,
    BsCreditCardFill,
    BsGearFill,
    BsBoxArrowRight,
    BsBarChartFill
} from 'react-icons/bs';

const Sidebar: React.FC = () => {
    const { user, logout } = useContext(AuthContext)!;
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: `/${user?.role}`, icon: <BsGrid1X2Fill />, roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'] },
        { name: 'Patients', path: '/patients', icon: <BsPeopleFill />, roles: ['admin', 'doctor', 'receptionist', 'nurse'] },
        { name: 'Appointments', path: '/appointments', icon: <BsCalendarCheckFill />, roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'] },
        { name: 'EMR / Records', path: '/medical-records', icon: <BsFileEarmarkMedicalFill />, roles: ['admin', 'doctor', 'patient', 'receptionist', 'nurse'] },
        { name: 'Inventory', path: '/inventory', icon: <BsInboxesFill />, roles: ['admin', 'doctor', 'receptionist', 'nurse'] },
        { name: 'Billing', path: '/billing', icon: <BsCreditCardFill />, roles: ['admin', 'receptionist'] },
        { name: 'Staff', path: '/staff', icon: <BsPeopleFill />, roles: ['admin'] },
        { name: 'Reports', path: '/reports', icon: <BsBarChartFill />, roles: ['admin'] },
        { name: 'Settings', path: '/settings', icon: <BsGearFill />, roles: ['admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || ''));

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto shadow-sm">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ClinicOS
                </h1>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Enterprise v4.0</p>
            </div>

            <nav className="flex-grow px-4 space-y-1">
                {filteredItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                }`}
                        >
                            <span className={`text-xl ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white">
                            {user?.name?.[0].toUpperCase()}
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-semibold"
                >
                    <BsBoxArrowRight className="text-xl" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
