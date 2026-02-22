import Medicine from './medicine.model';
import DispenseLog from './dispenseLog.model';
import PharmacyInvoice from './pharmacyInvoice.model';
import Prescription from '../doctor/prescription.model';
import ApiError from '../../utils/ApiError';
import AuditLog from '../auditLogs/auditLog.model';

class PharmacistService {
    // Internal Audit helper inside Service for Pharmacy Context
    private async logAction(userId: any, action: string, entity: string, entityId: any, prev: any, next: any) {
        await AuditLog.create({
            userId, role: 'pharmacist', action, entity, entityId, previousValue: prev, newValue: next
        });
    }

    async getDashboardSummary() {
        const todaySearch = new Date();
        todaySearch.setHours(0, 0, 0, 0);

        const pendingPrescriptionsCount = await Prescription.countDocuments({ status: { $in: ['Pending', 'Partially Dispensed'] } });

        const dispensesToday = await DispenseLog.countDocuments({ timestamp: { $gte: todaySearch } });

        const lowStockItems = await Medicine.countDocuments({
            $expr: { $lt: [{ $sum: "$batches.quantity" }, "$reorderThreshold"] } // Aggregated across batches
        });

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringItemsCount = await Medicine.countDocuments({
            "batches.expiryDate": { $gte: todaySearch, $lt: thirtyDaysFromNow }
        });

        // Revenue Today
        const invoicesToday = await PharmacyInvoice.find({ status: 'Paid', updatedAt: { $gte: todaySearch } });
        const revenueToday = invoicesToday.reduce((sum, inv) => sum + inv.netAmount, 0);

        return {
            pendingPrescriptions: pendingPrescriptionsCount,
            dispensedToday: dispensesToday,
            lowStockItems,
            expiringItems: expiringItemsCount,
            revenueToday
        };
    }

    // --- Inventory Management ---

    async getInventory() {
        return await Medicine.find({ isDeleted: false }).sort({ name: 1 });
    }

    async addMedicine(data: any, pharmacistId: string) {
        const medicine = await Medicine.create(data);
        await this.logAction(pharmacistId, 'ADD_MEDICINE', 'Medicine', medicine._id, null, data);
        return medicine;
    }

    async updateMedicine(id: string, data: any, pharmacistId: string) {
        const medicine = await Medicine.findById(id);
        if (!medicine) throw new ApiError(404, "Medicine not found");

        Object.assign(medicine, data);
        await medicine.save();

        await this.logAction(pharmacistId, 'UPDATE_MEDICINE', 'Medicine', medicine._id, null, data);
        return medicine;
    }

    async addBatch(medicineId: string, batchData: any, pharmacistId: string) {
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) throw new ApiError(404, "Medicine not found");

        medicine.batches.push(batchData);
        await medicine.save();

        await this.logAction(pharmacistId, 'ADD_BATCH', 'Medicine', medicine._id, null, batchData);
        return medicine;
    }

    async getLowStockAlerts() {
        // Find medicines whose total batch quantity is less than threshold
        const medicines = await Medicine.aggregate([
            { $unwind: { path: "$batches", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    category: { $first: "$category" },
                    reorderThreshold: { $first: "$reorderThreshold" },
                    totalStock: { $sum: "$batches.quantity" },
                }
            },
            { $match: { $expr: { $lt: ["$totalStock", "$reorderThreshold"] } } }
        ]);

        const todaySearch = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiring = await Medicine.find({
            "batches.expiryDate": { $gt: todaySearch, $lt: thirtyDaysFromNow }
        }).select('name batches');

        return { lowStock: medicines, expiring };
    }

    // --- Prescriptions & Dispensing ---

    async getPendingPrescriptions(filters: any) {
        let query: any = {};
        if (filters.status) query.status = filters.status;
        else query.status = { $in: ['Pending', 'Partially Dispensed'] };

        return await Prescription.find(query)
            .populate('patientId', 'name phone')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } })
            .sort({ createdAt: -1 });
    }

    async getPrescriptionById(id: string) {
        return await Prescription.findById(id)
            .populate('patientId', 'name phone')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });
    }

    async dispenseMedicine(prescriptionId: string, dispenses: { itemId: string, quantityToDispense: number, actualMedicineId: string, genericOverride?: boolean }[], pharmacistId: string) {
        // Note: For a robust system, this should be wrapped in a Mongoose Transaction (Session).
        // Since replica sets aren't guaranteed in the basic setup, we'll do careful sequential updates.

        const prescription = await Prescription.findById(prescriptionId).populate('patientId');
        if (!prescription) throw new ApiError(404, "Prescription not found");
        if (prescription.status === 'Completed') throw new ApiError(400, "Prescription already fully dispensed");

        const patientId = prescription.patientId._id;

        for (const disp of dispenses) {
            // Find item in prescription
            const pItem = prescription.items.find(i => i._id.toString() === disp.itemId);
            if (!pItem) throw new ApiError(400, "Invalid prescription item ID");
            if (pItem.status === 'Dispensed') continue;

            const remainingAllowed = pItem.quantityPrescribed - pItem.quantityDispensed;
            if (disp.quantityToDispense > remainingAllowed) {
                throw new ApiError(400, `Cannot dispense more than prescribed for ${pItem.medicineName}`);
            }

            // Find stock
            const medicine = await Medicine.findById(disp.actualMedicineId);
            if (!medicine) throw new ApiError(400, `Medicine Inventory not found for dispensed item.`);

            // Deduct from batches (FIFO: earliest expiry first)
            let remainingToDeduct = disp.quantityToDispense;

            // Sort batches by expiry
            medicine.batches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

            for (const batch of medicine.batches) {
                if (remainingToDeduct === 0) break;
                if (batch.quantity === 0) continue;

                const deductAmount = Math.min(batch.quantity, remainingToDeduct);
                batch.quantity -= deductAmount;
                remainingToDeduct -= deductAmount;

                // Log this specific dispense
                await DispenseLog.create({
                    prescriptionId: prescription._id,
                    medicineId: medicine._id,
                    batchId: batch._id,
                    quantityDispensed: deductAmount,
                    pharmacistId,
                    patientId
                });
            }

            if (remainingToDeduct > 0) {
                // Not enough stock across all batches
                throw new ApiError(400, `Insufficient stock for ${medicine.name}. Short by ${remainingToDeduct}`);
            }

            // Save inventory change
            await medicine.save();

            // Update prescription item state
            pItem.quantityDispensed += disp.quantityToDispense;
            if (pItem.quantityDispensed >= pItem.quantityPrescribed) {
                pItem.status = 'Dispensed';
            } else {
                pItem.status = 'Partially Dispensed';
            }
        }

        // Check if entire prescription is complete
        const allCompleted = prescription.items.every(item => item.status === 'Dispensed');
        const anyPartial = prescription.items.some(item => item.quantityDispensed > 0);

        prescription.status = allCompleted ? 'Completed' : (anyPartial ? 'Partially Dispensed' : 'Pending');
        await prescription.save();

        await this.logAction(pharmacistId, 'DISPENSE_PRESCRIPTION', 'Prescription', prescription._id, null, { status: prescription.status });

        return prescription;
    }

    // --- Billing ---

    async getInvoices() {
        return await PharmacyInvoice.find()
            .populate('patientId', 'name')
            .populate('prescriptionId')
            .sort({ createdAt: -1 });
    }

    async generateInvoice(data: any, pharmacistId: string) {
        const invoice = await PharmacyInvoice.create({ ...data, createdBy: pharmacistId });
        await this.logAction(pharmacistId, 'GENERATE_PHARMACY_INVOICE', 'PharmacyInvoice', invoice._id, null, invoice);
        return invoice;
    }

    async payInvoice(invoiceId: string, paymentMethod: string, pharmacistId: string) {
        const invoice = await PharmacyInvoice.findById(invoiceId);
        if (!invoice) throw new ApiError(404, "Invoice not found");
        if (invoice.status === 'Paid') throw new ApiError(400, "Already internal paid");

        invoice.status = 'Paid';
        invoice.paymentMethod = paymentMethod as any;
        invoice.paidAt = new Date();
        await invoice.save();

        await this.logAction(pharmacistId, 'PAY_PHARMACY_INVOICE', 'PharmacyInvoice', invoice._id, null, { paymentMethod });
        return invoice;
    }

    // --- Patient History ---
    async getPatientPrescriptionHistory(patientId: string) {
        const prescriptions = await Prescription.find({ patientId }).sort({ createdAt: -1 })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });

        const dispenseLogs = await DispenseLog.find({ patientId }).sort({ timestamp: -1 })
            .populate('medicineId', 'name')
            .populate('pharmacistId', 'name');

        return { prescriptions, dispenseLogs };
    }
}

export default new PharmacistService();
