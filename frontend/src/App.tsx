import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GuidedTour from './components/GuidedTour';
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DashboardLayout from './components/DashboardLayout';

import {
  Patients,
  Appointments,
  MedicalRecords,
  Billing,
  Inventory,
  Staff,
  Reports,
  Settings
} from './pages/internal/InternalPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <GuidedTour />

            <main className="flex-grow bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctors/:id" element={<DoctorDetails />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard Routes with Sidebar Layout */}
                <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientDashboard /></DashboardLayout></ProtectedRoute>} />
                <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorDashboard /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />

                <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist', 'nurse']}><DashboardLayout><Patients /></DashboardLayout></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient', 'receptionist', 'nurse']}><DashboardLayout><Appointments /></DashboardLayout></ProtectedRoute>} />
                <Route path="/medical-records" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient', 'receptionist', 'nurse']}><DashboardLayout><MedicalRecords /></DashboardLayout></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist', 'nurse']}><DashboardLayout><Inventory /></DashboardLayout></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><DashboardLayout><Billing /></DashboardLayout></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Staff /></DashboardLayout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
              </Routes>
            </main>

            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
