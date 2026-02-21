const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
