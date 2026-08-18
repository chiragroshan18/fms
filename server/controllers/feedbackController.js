const prisma = require('../utils/prisma');

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private (USER/ADMIN)
const createFeedback = async (req, res, next) => {
  try {
    const { categoryId, rating, comment } = req.body;

    if (!categoryId || !rating || !comment) {
      res.status(400);
      throw new Error('Please fill in all fields (category, rating, comment)');
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400);
      throw new Error('Rating must be an integer between 1 and 5');
    }

    if (comment.trim().length === 0) {
      res.status(400);
      throw new Error('Comment cannot be empty');
    }

    if (comment.length > 1000) {
      res.status(400);
      throw new Error('Comment exceeds maximum allowed length (1000 characters)');
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(404);
      throw new Error('Selected feedback category not found');
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        categoryId,
        rating: numRating,
        comment: comment.trim(),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's feedback list
// @route   GET /api/feedback/my
// @access  Private (USER)
const getMyFeedback = async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { userId: req.user.id },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback by ID
// @route   GET /api/feedback/:id
// @access  Private (Owner or Admin)
const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await prisma.feedback.findUnique({
      where: { id },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!feedback) {
      res.status(404);
      throw new Error('Feedback record not found');
    }

    // Authorization check
    if (feedback.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403);
      throw new Error('Not authorized to view this feedback');
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's own feedback
// @route   PUT /api/feedback/:id
// @access  Private (Owner only)
const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryId, rating, comment } = req.body;

    const existing = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404);
      throw new Error('Feedback record not found');
    }

    // Strict ownership verification
    if (existing.userId !== req.user.id) {
      res.status(403);
      throw new Error('You can only modify your own submitted feedback');
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400);
      throw new Error('Rating must be an integer between 1 and 5');
    }

    if (!comment || comment.trim().length === 0) {
      res.status(400);
      throw new Error('Comment cannot be empty');
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        categoryId: categoryId || existing.categoryId,
        rating: numRating,
        comment: comment.trim(),
      },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user's own feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Owner only)
const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404);
      throw new Error('Feedback record not found');
    }

    // Strict ownership check
    if (existing.userId !== req.user.id) {
      res.status(403);
      throw new Error('You can only delete your own submitted feedback');
    }

    await prisma.feedback.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stats for user dashboard
// @route   GET /api/dashboard/user
// @access  Private (USER/ADMIN)
const getUserDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Database aggregate for total feedback & average rating
    const aggregate = await prisma.feedback.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { rating: true },
    });

    const totalFeedback = aggregate._count.id;
    const averageRating = aggregate._avg.rating
      ? Number(aggregate._avg.rating.toFixed(1))
      : 0;

    // Latest feedback
    const latest = await prisma.feedback.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    // Rating distribution
    const ratingGroup = await prisma.feedback.groupBy({
      by: ['rating'],
      where: { userId },
      _count: { rating: true },
    });

    const ratingMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingGroup.forEach((rg) => {
      ratingMap[rg.rating] = rg._count.rating;
    });

    const ratingDistribution = [
      { stars: '5 Stars', count: ratingMap[5], rating: 5 },
      { stars: '4 Stars', count: ratingMap[4], rating: 4 },
      { stars: '3 Stars', count: ratingMap[3], rating: 3 },
      { stars: '2 Stars', count: ratingMap[2], rating: 2 },
      { stars: '1 Star', count: ratingMap[1], rating: 1 },
    ];

    // Top Category
    const categoryGroup = await prisma.feedback.groupBy({
      by: ['categoryId'],
      where: { userId },
      _count: { categoryId: true },
      orderBy: {
        _count: { categoryId: 'desc' },
      },
      take: 1,
    });

    let topCategory = 'None';
    if (categoryGroup.length > 0) {
      const catObj = await prisma.category.findUnique({
        where: { id: categoryGroup[0].categoryId },
      });
      if (catObj) topCategory = catObj.name;
    }

    res.json({
      success: true,
      data: {
        totalFeedback,
        averageRating,
        latestFeedbackDate: latest ? latest.createdAt : null,
        topCategory,
        ratingDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getUserDashboardStats,
};
