import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { BsCapsule, BsPlusCircleFill, BsSearch, BsPencilSquare, BsTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';

const PharmacistInventory: React.FC = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '', category: 'General', dosageForm: 'Tablet', strength: '', reorderThreshold: 10
    });
    const [saving, setSaving] = useState(false);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/pharmacist/inventory');
            setInventory(res.data.data);
        } catch (err) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    const handleAddMedicine = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await axiosInstance.post('/api/pharmacist/inventory', formData);
            toast.success('Medicine added to core directory');
            setShowModal(false);
            setFormData({ name: '', category: 'General', dosageForm: 'Tablet', strength: '', reorderThreshold: 10 });
            fetchInventory();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add medicine');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Inventory Directory</h1>
                    <p className="text-gray-500 mt-2">Manage the pharmacy formulary and master stock variables.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition font-bold shadow-sm flex items-center space-x-2"
                >
                    <BsPlusCircleFill />
                    <span>Add Product Directory</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search formulation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Medication Entity</th>
                                <th className="px-6 py-4">Form / Strength</th>
                                <th className="px-6 py-4 text-center">Active Batches</th>
                                <th className="px-6 py-4 text-center">Total Stock Qty</th>
                                <th className="px-6 py-4 text-center">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><Skeleton width={150} /></td>
                                        <td className="px-6 py-4"><Skeleton width={100} /></td>
                                        <td className="px-6 py-4"><Skeleton width={40} /></td>
                                        <td className="px-6 py-4"><Skeleton width={40} /></td>
                                        <td className="px-6 py-4"><Skeleton width={80} /></td>
                                    </tr>
                                ))
                            ) : filteredInventory.length > 0 ? (
                                filteredInventory.map((item: any) => {
                                    const totalStock = item.batches?.reduce((acc: number, b: any) => acc + b.quantity, 0) || 0;
                                    const isLowStock = totalStock < item.reorderThreshold;

                                    return (
                                        <tr key={item._id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        <BsCapsule />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{item.name}</p>
                                                        <p className="text-xs text-gray-500">{item.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {item.dosageForm} - {item.strength}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-800">
                                                {item.batches?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {totalStock} {isLowStock && '⚠️'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => toast.info('Add batch to master record...')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Add Receiving Batch">
                                                        <BsPlusCircleFill />
                                                    </button>
                                                    <button onClick={() => toast.info('Edit details pending')} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition">
                                                        <BsPencilSquare />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No formulary items found. Add the first medicine.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[99] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">New Product Directory Entry</h3>
                        </div>
                        <form onSubmit={handleAddMedicine} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Medication Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Form</label>
                                    <select value={formData.dosageForm} onChange={e => setFormData({ ...formData, dosageForm: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>Tablet</option>
                                        <option>Syrup</option>
                                        <option>Injection</option>
                                        <option>Cream</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Strength (e.g. 500mg)</label>
                                    <input type="text" value={formData.strength} onChange={e => setFormData({ ...formData, strength: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Low-Stock Alert Qty</label>
                                    <input type="number" value={formData.reorderThreshold} onChange={e => setFormData({ ...formData, reorderThreshold: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required min="1" />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Save Product Entity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacistInventory;
