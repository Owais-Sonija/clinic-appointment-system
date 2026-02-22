import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { BsArrowLeft, BsCheckCircleFill, BsExclamationTriangleFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const PharmacistDispense: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState<any>(null);
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dispensing, setDispensing] = useState(false);

    // Map of prescription item ID -> selected inventory ID and quantity
    const [dispenseState, setDispenseState] = useState<any>({});

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pRes, iRes] = await Promise.all([
                axiosInstance.get(`/api/pharmacist/prescriptions/${id}`),
                axiosInstance.get('/api/pharmacist/inventory')
            ]);
            setPrescription(pRes.data.data);
            setInventory(iRes.data.data);

            // Initialize states
            const initState: any = {};
            pRes.data.data.items.forEach((item: any) => {
                if (item.status !== 'Dispensed') {
                    // Try to auto-match name loosely
                    const match = iRes.data.data.find((inv: any) => inv.name.toLowerCase() === item.medicineName.toLowerCase() || (inv.genericName && inv.genericName.toLowerCase() === item.medicineName.toLowerCase()));

                    initState[item._id] = {
                        actualMedicineId: match ? match._id : '',
                        quantityToDispense: item.quantityPrescribed - item.quantityDispensed, // Default to fulfill remainder
                        maxAllowed: item.quantityPrescribed - item.quantityDispensed
                    };
                }
            });
            setDispenseState(initState);
        } catch (error) {
            toast.error('Failed to load prescription or inventory details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const handleStateChange = (itemId: string, field: string, value: any) => {
        setDispenseState((prev: any) => ({
            ...prev,
            [itemId]: { ...prev[itemId], [field]: value }
        }));
    };

    const handleDispenseSubmit = async () => {
        const dispensesToSubmit = Object.keys(dispenseState)
            .map(itemId => ({
                itemId,
                actualMedicineId: dispenseState[itemId].actualMedicineId,
                quantityToDispense: Number(dispenseState[itemId].quantityToDispense)
            }))
            .filter(d => d.quantityToDispense > 0 && d.actualMedicineId); // Only submit non-zero defined items

        if (dispensesToSubmit.length === 0) {
            toast.warning('Please select stock and enter valid dispense quantities for at least one item.');
            return;
        }

        try {
            setDispensing(true);
            await axiosInstance.put(`/api/pharmacist/prescriptions/${id}/dispense`, { dispenses: dispensesToSubmit });
            toast.success('Medicine dispensed and stock updated successfully.');
            navigate('/pharmacist/prescriptions');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to dispense');
        } finally {
            setDispensing(false);
        }
    };

    if (loading) return <div className="p-6 max-w-5xl mx-auto"><Skeleton height={400} /></div>;
    if (!prescription) return <div className="p-6 text-center">Prescription not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <button onClick={() => navigate('/pharmacist/prescriptions')} className="text-indigo-600 font-bold flex items-center hover:text-indigo-800 transition">
                <BsArrowLeft className="mr-2" /> Back to Queue
            </button>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Fulfill Prescription</h1>
                    <p className="text-sm font-mono text-gray-500 mt-1 uppercase">Ref: {prescription._id.substr(-8)}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-800">Patient: {prescription.patientId?.name}</p>
                    <p className="text-sm text-gray-500">Dr. {prescription.doctorId?.userId?.name}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                    <h3 className="font-bold text-indigo-900">Requested Medications</h3>
                </div>

                <div className="divide-y divide-gray-100 p-4 space-y-4">
                    {prescription.items.map((item: any) => {
                        const isDispensed = item.status === 'Dispensed';
                        const state = dispenseState[item._id] || {};
                        const selectedInv = inventory.find(inv => inv._id === state.actualMedicineId);
                        const invStock = selectedInv ? selectedInv.batches.reduce((sum: number, b: any) => sum + b.quantity, 0) : 0;

                        return (
                            <div key={item._id} className={`p-4 rounded-xl border ${isDispensed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200'}`}>
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div className="mb-2 md:mb-0">
                                        <h4 className="text-lg font-bold text-gray-800">{item.medicineName}</h4>
                                        <p className="text-sm text-gray-600 font-medium">Sig: {item.dosage} | {item.frequency} for {item.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-500">Ordered Qty: <span className="text-gray-800 text-lg">{item.quantityPrescribed}</span></p>
                                        <p className="text-xs text-gray-400">Dispensed so far: {item.quantityDispensed}</p>
                                    </div>
                                </div>

                                {isDispensed ? (
                                    <div className="flex items-center text-emerald-600 font-black bg-emerald-50 px-4 py-2 rounded-lg">
                                        <BsCheckCircleFill className="mr-2" /> FULFILLED
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Inventory Stock</label>
                                            <select
                                                value={state.actualMedicineId || ''}
                                                onChange={(e) => handleStateChange(item._id, 'actualMedicineId', e.target.value)}
                                                className="w-full bg-white border border-gray-200 text-sm py-2 px-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            >
                                                <option value="">-- Manual Selection Needed --</option>
                                                {inventory.map((inv: any) => {
                                                    const qty = inv.batches.reduce((sum: number, b: any) => sum + b.quantity, 0);
                                                    return <option key={inv._id} value={inv._id}>{inv.name} ({inv.strength}) - Stock: {qty}</option>;
                                                })}
                                            </select>
                                            {selectedInv && invStock < state.quantityToDispense && (
                                                <p className="text-xs text-red-500 font-bold flex items-center mt-1">
                                                    <BsExclamationTriangleFill className="mr-1" /> Insufficient Stock
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity to Dispense Now</label>
                                            <input
                                                type="number"
                                                value={state.quantityToDispense}
                                                onChange={(e) => handleStateChange(item._id, 'quantityToDispense', Math.min(Number(e.target.value), state.maxAllowed))}
                                                max={state.maxAllowed}
                                                min={0}
                                                className="w-full bg-white border border-gray-200 text-sm py-2 px-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1">Max allowed limit: {state.maxAllowed}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {prescription.status !== 'Completed' && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                        <button
                            onClick={handleDispenseSubmit}
                            disabled={dispensing}
                            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {dispensing ? 'Processing Dispense...' : 'Complete Dispense & Update Stock'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PharmacistDispense;
