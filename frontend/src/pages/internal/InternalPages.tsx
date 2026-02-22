import React from 'react';

const PagePlaceholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">This module is part of the Phase 4 Enterprise Upgrade.</p>
        <div className="animate-pulse bg-gray-50 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400 font-medium">Content for {title} coming soon...</span>
        </div>
    </div>
);

export { Patients } from '../../features/patients/Patients';
export { default as Appointments } from '../../features/appointments/Appointments';
export { default as MedicalRecords } from '../../features/emr/MedicalRecords';
export { default as Billing } from '../../features/billing/Billing';
export { Inventory } from '../../features/inventory/Inventory';
export { Staff } from '../../features/staff/Staff';
export { default as Reports } from '../../features/reports/Reports';
export { Settings } from '../../features/settings/Settings';
