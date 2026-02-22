import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/axiosInstance';
import DataTable from 'react-data-table-component';
import { BsPlusSquareFill, BsBoxSeam, BsExclamationTriangleFill, BsArrowDownUp } from 'react-icons/bs';

const fetchInventory = async () => (await axiosInstance.get('/api/inventory')).data?.data || [];

export const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: inventory = [], isLoading } = useQuery({ queryKey: ['inventory-list'], queryFn: fetchInventory });

    const lowStockItems = inventory.filter((i: any) => i.stockQuantity <= i.reorderLevel);

    const columns = [
        {
            name: 'Item / Batch',
            selector: (row: any) => row.itemName,
            sortable: true,
            cell: (row: any) => (
                <div className="flex flex-col py-3">
                    <span className="font-bold text-gray-900">{row.itemName}</span>
                    <span className="text-xs text-gray-500 font-mono">BATCH: {row.batchNumber || 'N/A'}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 w-fit px-1.5 rounded mt-1">{row.category}</span>
                </div>
            )
        },
        {
            name: 'Stock Status',
            selector: (row: any) => row.stockQuantity,
            sortable: true,
            cell: (row: any) => {
                const isLow = row.stockQuantity <= row.reorderLevel;
                return (
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-100 rounded-full h-2 min-w-[80px]">
                            <div
                                className={`h-2 rounded-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (row.stockQuantity / row.reorderLevel) * 50)}%` }}
                            ></div>
                        </div>
                        <span className={`text-sm font-bold ${isLow ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {row.stockQuantity} {row.unit}
                        </span>
                    </div>
                );
            }
        },
        {
            name: 'Selling Price',
            selector: (row: any) => row.sellingPrice || row.unitPrice,
            sortable: true,
            cell: (row: any) => <span className="font-bold text-blue-600">${row.sellingPrice || row.unitPrice}</span>
        },
        {
            name: 'Expiry',
            selector: (row: any) => row.expiryDate,
            sortable: true,
            cell: (row: any) => {
                if (!row.expiryDate) return <span className="text-gray-400">-</span>;
                const isExpired = new Date(row.expiryDate) < new Date();
                return (
                    <span className={`text-xs font-semibold ${isExpired ? 'text-red-500 underline decoration-wavy' : 'text-gray-600'}`}>
                        {new Date(row.expiryDate).toLocaleDateString()}
                    </span>
                );
            }
        },
        {
            name: 'Actions',
            cell: (row: any) => (
                <div className="flex gap-2">
                    <button className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition">
                        <BsArrowDownUp /> Adjust
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory & Pharmacy</h2>
                    <p className="text-gray-500 font-medium">Monitor stock levels, batches, and price lists.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all">
                    <BsPlusSquareFill className="text-xl" />
                    <span>Receive Stock</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                        <BsBoxSeam />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase">Total Items</p>
                        <h4 className="text-2xl font-black text-gray-800">{inventory.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${lowStockItems.length > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
                        <BsExclamationTriangleFill />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase">Low Stock</p>
                        <h4 className="text-2xl font-black text-gray-800">{lowStockItems.length}</h4>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={inventory}
                    progressPending={isLoading}
                    pagination
                    highlightOnHover
                    responsive
                    customStyles={{
                        headRow: { style: { backgroundColor: '#f9fafb', fontWeight: 'bold' } },
                        headCells: { style: { color: '#64748b', fontSize: '11px', textTransform: 'uppercase' } }
                    }}
                />
            </div>
        </div>
    );
};
