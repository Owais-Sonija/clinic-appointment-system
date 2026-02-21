const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        await service.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
