import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import { BsGear, BsBuilding, BsWallet2, BsGlobeCentralSouthAsia, BsShieldCheck } from 'react-icons/bs';
import { toast } from 'react-toastify';

const fetchClinic = async () => (await axiosInstance.get('/api/clinic')).data?.data || {};

export const Settings = () => {
    const { data: clinic = {}, isLoading } = useQuery({ queryKey: ['clinic-settings'], queryFn: fetchClinic });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        toast.info('Settings update functionality is read-only in this demo.');
    };

    if (isLoading) return <div className="animate-pulse p-10 bg-white rounded-3xl h-96"></div>;

    return (
        <div className="max-w-4xl space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Clinic Configuration</h2>
                <p className="text-gray-500 font-medium">Manage enterprise-level settings, branding, and regional preferences.</p>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <BsBuilding className="text-blue-600" /> Business Identity
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Clinic Name</label>
                            <input type="text" defaultValue={clinic.name} className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registration Number</label>
                            <input type="text" defaultValue={clinic.registrationNumber || 'REG-2026-MED'} className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tax ID (VAT)</label>
                            <input type="text" defaultValue={clinic.taxNumber} className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <BsGlobeCentralSouthAsia className="text-blue-600" /> Regional & Localization
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Currency</label>
                            <select defaultValue={clinic.currency} className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500">
                                <option value="USD">USD ($) - US Dollar</option>
                                <option value="EUR">EUR (€) - Euro</option>
                                <option value="GBP">GBP (£) - British Pound</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timezone</label>
                            <select defaultValue={clinic.timezone} className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500">
                                <option value="UTC">UTC (Universal Time)</option>
                                <option value="GT">GST (Gulf Standard Time)</option>
                                <option value="EST">EST (Eastern Standard Time)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Invoice Prefix</label>
                            <input type="text" defaultValue={clinic.invoicePrefix || 'INV-'} className="w-full mt-2 bg-gray-50 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                            <BsShieldCheck />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Security & Compliance</p>
                            <p className="text-sm text-gray-500">Audit logs and enterprise role-based access are enabled.</p>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105">
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
};
