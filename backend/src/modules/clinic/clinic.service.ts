import Clinic, { IClinic } from './clinic.model';
import Service, { IService } from './service.model';
import Contact, { IContact } from './contact.model';
import ApiError from '../../utils/ApiError';

class ClinicService {
    // ---- Clinic Settings ----
    async getClinicSettings(): Promise<IClinic> {
        let settings = await Clinic.findOne();
        if (!settings) {
            settings = await Clinic.create({ name: 'Default Clinic' });
        }
        return settings;
    }

    async updateClinicSettings(data: object): Promise<IClinic> {
        let settings = await Clinic.findOne();
        if (!settings) {
            settings = await Clinic.create(data);
        } else {
            settings = await Clinic.findOneAndUpdate({}, data, { new: true, runValidators: true });
            if (!settings) throw new ApiError(500, 'Error updating clinic settings');
        }
        settings.isConfigured = true;
        await settings.save();
        return settings;
    }

    // ---- Services ----
    async getAllServices(activeOnly: boolean = false): Promise<IService[]> {
        const filter = activeOnly ? { isActive: true } : {};
        return await Service.find(filter);
    }

    async getServiceById(id: string): Promise<IService> {
        const service = await Service.findById(id);
        if (!service) throw new ApiError(404, 'Service not found');
        return service;
    }

    async createService(data: Partial<IService>): Promise<IService> {
        return await Service.create(data);
    }

    async updateService(id: string, data: object): Promise<IService> {
        const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!service) throw new ApiError(404, 'Service not found');
        return service;
    }

    async deleteService(id: string): Promise<IService> {
        const service = await Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!service) throw new ApiError(404, 'Service not found');
        return service;
    }

    // ---- Contact Messages ----
    async submitContactMessage(data: Partial<IContact>): Promise<IContact> {
        return await Contact.create(data);
    }

    async getContactMessages(): Promise<IContact[]> {
        return await Contact.find().sort({ createdAt: -1 });
    }

    async markMessageAsRead(id: string): Promise<IContact> {
        const msg = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!msg) throw new ApiError(404, 'Message not found');
        return msg;
    }
}

export default new ClinicService();
