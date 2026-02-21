const Contact = require('../models/Contact');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res, next) => {
    try {
        const message = await Contact.create(req.body);
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res, next) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitContactMessage,
    getContactMessages
};
