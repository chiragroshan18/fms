const express = require('express');
const {
  register,
  login,
  getMe,
  directResetPassword,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/direct-reset-password', directResetPassword);
router.put('/change-password', protect, changePassword);

module.exports = router;
