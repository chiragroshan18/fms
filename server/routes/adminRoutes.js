const express = require('express');
const {
  getAdminStats,
  getAdminFeedbackList,
  adminDeleteFeedback,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/feedback', getAdminFeedbackList);
router.delete('/feedback/:id', adminDeleteFeedback);

// Category Management Routes
router.get('/categories', adminGetCategories);
router.post('/categories', adminCreateCategory);
router.put('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

module.exports = router;
