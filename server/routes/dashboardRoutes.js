const express = require('express');
const { getUserDashboardStats } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user', protect, getUserDashboardStats);

module.exports = router;
