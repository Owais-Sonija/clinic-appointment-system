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
import PatientOverview from './pages/dashboard/patient/PatientOverview';
import BookAppointment from './pages/dashboard/patient/BookAppointment';
import PatientAppointments from './pages/dashboard/patient/PatientAppointments';
import PatientMedicalRecords from './pages/dashboard/patient/PatientMedicalRecords';
import PatientPrescriptions from './pages/dashboard/patient/PatientPrescriptions';
import PatientProfile from './pages/dashboard/patient/PatientProfile';
import PatientBilling from './pages/dashboard/patient/PatientBilling';
import PatientNotifications from './pages/dashboard/patient/PatientNotifications';
import AdminOverview from './pages/dashboard/admin/AdminOverview';
import AdminDoctors from './pages/dashboard/admin/AdminDoctors';
import AdminPatients from './pages/dashboard/admin/AdminPatients';
import AdminAppointments from './pages/dashboard/admin/AdminAppointments';
import AdminMedicalRecords from './pages/dashboard/admin/AdminMedicalRecords';
import AdminSchedules from './pages/dashboard/admin/AdminSchedules';
import AdminBilling from './pages/dashboard/admin/AdminBilling';
import AdminNotifications from './pages/dashboard/admin/AdminNotifications';
import AdminAuditLogs from './pages/dashboard/admin/AdminAuditLogs';
import AdminSettings from './pages/dashboard/admin/AdminSettings';
import DoctorOverview from './pages/dashboard/doctor/DoctorOverview';
import DoctorAppointments from './pages/dashboard/doctor/DoctorAppointments';
import DoctorMedicalRecords from './pages/dashboard/doctor/DoctorMedicalRecords';
import DoctorSchedule from './pages/dashboard/doctor/DoctorSchedule';
import DoctorProfile from './pages/dashboard/doctor/DoctorProfile';
import DoctorEMRForm from './pages/dashboard/doctor/DoctorEMRForm';
import PatientHistory from './pages/dashboard/doctor/PatientHistory';
import DashboardLayout from './components/DashboardLayout';

import NurseOverview from './pages/dashboard/nurse/NurseOverview';
import NurseAppointments from './pages/dashboard/nurse/NurseAppointments';
import RecordVitals from './pages/dashboard/nurse/RecordVitals';
import NursingNotes from './pages/dashboard/nurse/NursingNotes';
import NursePatientHistory from './pages/dashboard/nurse/NursePatientHistory';

import ReceptionistOverview from './pages/dashboard/receptionist/ReceptionistOverview';
import ReceptionistPatients from './pages/dashboard/receptionist/ReceptionistPatients';
import ReceptionistAppointments from './pages/dashboard/receptionist/ReceptionistAppointments';
import ReceptionistBilling from './pages/dashboard/receptionist/ReceptionistBilling';
import ReceptionistReports from './pages/dashboard/receptionist/ReceptionistReports';

// Pharmacist Pages
import PharmacistOverview from './pages/dashboard/pharmacist/PharmacistOverview';
import PharmacistPrescriptions from './pages/dashboard/pharmacist/PharmacistPrescriptions';
import PharmacistDispense from './pages/dashboard/pharmacist/PharmacistDispense';
import PharmacistInventory from './pages/dashboard/pharmacist/PharmacistInventory';
import PharmacistBilling from './pages/dashboard/pharmacist/PharmacistBilling';

// Admin Pages
import AdminOverview from './pages/dashboard/admin/AdminOverview';
import AdminUsers from './pages/dashboard/admin/AdminUsers';
import AdminAuditLogs from './pages/dashboard/admin/AdminAuditLogs';
import AdminSettings from './pages/dashboard/admin/AdminSettings';

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

                {/* Patient Routes */}
                <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><BookAppointment /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientAppointments /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/medical-records" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientMedicalRecords /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/prescriptions" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientPrescriptions /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientProfile /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/billing" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientBilling /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patient/notifications" element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout><PatientNotifications /></DashboardLayout></ProtectedRoute>} />

                {/* Doctor Routes */}
                <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorAppointments /></DashboardLayout></ProtectedRoute>} />
                <Route path="/doctor/medical-records" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorMedicalRecords /></DashboardLayout></ProtectedRoute>} />
                <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorSchedule /></DashboardLayout></ProtectedRoute>} />
                <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorProfile /></DashboardLayout></ProtectedRoute>} />

                {/* Nurse Routes */}
                <Route path="/nurse" element={<ProtectedRoute allowedRoles={['nurse']}><DashboardLayout><NurseOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/nurse/appointments" element={<ProtectedRoute allowedRoles={['nurse']}><DashboardLayout><NurseAppointments /></DashboardLayout></ProtectedRoute>} />
                <Route path="/nurse/appointments/:id/vitals" element={<ProtectedRoute allowedRoles={['nurse']}><DashboardLayout><RecordVitals /></DashboardLayout></ProtectedRoute>} />
                <Route path="/nurse/appointments/:id/notes" element={<ProtectedRoute allowedRoles={['nurse']}><DashboardLayout><NursingNotes /></DashboardLayout></ProtectedRoute>} />
                <Route path="/nurse/patients/:id/history" element={<ProtectedRoute allowedRoles={['nurse']}><DashboardLayout><NursePatientHistory /></DashboardLayout></ProtectedRoute>} />

                {/* Receptionist Routes */}
                <Route path="/receptionist" element={<ProtectedRoute allowedRoles={['receptionist']}><DashboardLayout><ReceptionistOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/receptionist/patients" element={<ProtectedRoute allowedRoles={['receptionist']}><DashboardLayout><ReceptionistPatients /></DashboardLayout></ProtectedRoute>} />
                <Route path="/receptionist/appointments" element={<ProtectedRoute allowedRoles={['receptionist']}><DashboardLayout><ReceptionistAppointments /></DashboardLayout></ProtectedRoute>} />
                <Route path="/receptionist/billing" element={<ProtectedRoute allowedRoles={['receptionist']}><DashboardLayout><ReceptionistBilling /></DashboardLayout></ProtectedRoute>} />
                <Route path="/receptionist/reports" element={<ProtectedRoute allowedRoles={['receptionist']}><DashboardLayout><ReceptionistReports /></DashboardLayout></ProtectedRoute>} />

                {/* Pharmacist Dashboard Routes */}
                <Route path="/pharmacist" element={<ProtectedRoute allowedRoles={['pharmacist']}><DashboardLayout><PharmacistOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/pharmacist/prescriptions" element={<ProtectedRoute allowedRoles={['pharmacist']}><DashboardLayout><PharmacistPrescriptions /></DashboardLayout></ProtectedRoute>} />
                <Route path="/pharmacist/prescriptions/:id" element={<ProtectedRoute allowedRoles={['pharmacist']}><DashboardLayout><PharmacistDispense /></DashboardLayout></ProtectedRoute>} />
                <Route path="/pharmacist/inventory" element={<ProtectedRoute allowedRoles={['pharmacist']}><DashboardLayout><PharmacistInventory /></DashboardLayout></ProtectedRoute>} />
                <Route path="/pharmacist/billing" element={<ProtectedRoute allowedRoles={['pharmacist']}><DashboardLayout><PharmacistBilling /></DashboardLayout></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminOverview /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminUsers /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminUsers /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminUsers /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminAuditLogs /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminSettings /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/billing" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminBilling /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminNotifications /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminAuditLogs /></DashboardLayout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminSettings /></DashboardLayout></ProtectedRoute>} />

                <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist', 'nurse']}><DashboardLayout><Patients /></DashboardLayout></ProtectedRoute>} />
                <Route path="/patients/:patientId/history" element={<ProtectedRoute allowedRoles={['admin', 'doctor']}><DashboardLayout><PatientHistory /></DashboardLayout></ProtectedRoute>} />

                <Route path="/appointments" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient', 'receptionist', 'nurse']}><DashboardLayout><Appointments /></DashboardLayout></ProtectedRoute>} />
                <Route path="/appointments/:id" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}><DashboardLayout><Appointments /></DashboardLayout></ProtectedRoute>} />

                <Route path="/medical-records" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient', 'receptionist', 'nurse']}><DashboardLayout><MedicalRecords /></DashboardLayout></ProtectedRoute>} />
                <Route path="/medical-records/:recordId" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}><DashboardLayout><MedicalRecords /></DashboardLayout></ProtectedRoute>} />
                <Route path="/medical-records/new/:appointmentId" element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout><DoctorEMRForm /></DashboardLayout></ProtectedRoute>} />
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
