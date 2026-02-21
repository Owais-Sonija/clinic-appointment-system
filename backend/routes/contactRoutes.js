const express = require('express');
const router = express.Router();
const {
    submitContactMessage,
    getContactMessages
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.route('/')
    .post(submitContactMessage)
    .get(protect, authorizeRoles('admin'), getContactMessages);

module.exports = router;
