const Clinic = require('./clinic.model');
const Service = require('./service.model');
const Contact = require('./contact.model');
const ApiError = require('../../utils/ApiError');

class ClinicService {
    // ---- Clinic Settings ----
    async getClinicSettings() {
        let settings = await Clinic.findOne();
        if (!settings) {
            settings = await Clinic.create({ name: 'Default Clinic' });
        }
        return settings;
    }

    async updateClinicSettings(data) {
        let settings = await Clinic.findOne();
        if (!settings) {
            settings = await Clinic.create(data);
        } else {
            settings = await Clinic.findOneAndUpdate({}, data, { new: true, runValidators: true });
        }
        settings.isConfigured = true;
        await settings.save();
        return settings;
    }

    // ---- Services ----
    async getAllServices(activeOnly = false) {
        const filter = activeOnly ? { isActive: true } : {};
        return await Service.find(filter);
    }

    async getServiceById(id) {
        const service = await Service.findById(id);
        if (!service) throw new ApiError(404, 'Service not found');
        return service;
    }

    async createService(data) {
        return await Service.create(data);
    }

    async updateService(id, data) {
        const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!service) throw new ApiError(404, 'Service not found');
        return service;
    }

    async deleteService(id) {
        const service = await Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!service) throw new ApiError(404, 'Service not found');
        return service;
    }

    // ---- Contact Messages ----
    async submitContactMessage(data) {
        return await Contact.create(data);
    }

    async getContactMessages() {
        return await Contact.find().sort({ createdAt: -1 });
    }

    async markMessageAsRead(id) {
        const msg = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!msg) throw new ApiError(404, 'Message not found');
        return msg;
    }
}

module.exports = new ClinicService();
