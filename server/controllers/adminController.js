const prisma = require('../utils/prisma');

// @desc    Get admin dashboard aggregated statistics & chart data
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
const getAdminStats = async (req, res, next) => {
  try {
    const aggregate = await prisma.feedback.aggregate({
      _count: { id: true },
      _avg: { rating: true },
    });

    const totalFeedback = aggregate._count.id;
    const averageRating = aggregate._avg.rating
      ? Number(aggregate._avg.rating.toFixed(1))
      : 0;

    const positiveFeedback = await prisma.feedback.count({
      where: { rating: { gte: 4 } },
    });

    const negativeFeedback = await prisma.feedback.count({
      where: { rating: { lte: 2 } },
    });

    const ratingGroup = await prisma.feedback.groupBy({
      by: ['rating'],
      _count: { rating: true },
    });

    const ratingMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingGroup.forEach((rg) => {
      ratingMap[rg.rating] = rg._count.rating;
    });

    const ratingDistribution = [
      { name: '5 Stars', count: ratingMap[5], rating: 5 },
      { name: '4 Stars', count: ratingMap[4], rating: 4 },
      { name: '3 Stars', count: ratingMap[3], rating: 3 },
      { name: '2 Stars', count: ratingMap[2], rating: 2 },
      { name: '1 Star', count: ratingMap[1], rating: 1 },
    ];

    const categoryGroup = await prisma.feedback.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const categories = await prisma.category.findMany();
    const catNameMap = {};
    categories.forEach((c) => {
      catNameMap[c.id] = c.name;
    });

    const categoryDistribution = categoryGroup.map((cg) => ({
      name: catNameMap[cg.categoryId] || 'Unknown',
      count: cg._count.id,
    }));

    const recentFeedback = await prisma.feedback.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        category: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      data: {
        totalFeedback,
        averageRating,
        positiveFeedback,
        negativeFeedback,
        ratingDistribution,
        categoryDistribution,
        recentFeedback,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get paginated, filtered, & searched feedback list for Admin
// @route   GET /api/admin/feedback
// @access  Private (Admin Only)
const getAdminFeedbackList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, category, rating } = req.query;

    const where = {};

    if (category && category !== 'ALL') {
      where.categoryId = category;
    }

    if (rating && rating !== 'ALL') {
      where.rating = parseInt(rating, 10);
    }

    if (search && search.trim() !== '') {
      const searchStr = search.trim();
      where.OR = [
        { comment: { contains: searchStr, mode: 'insensitive' } },
        { user: { name: { contains: searchStr, mode: 'insensitive' } } },
        { user: { email: { contains: searchStr, mode: 'insensitive' } } },
      ];
    }

    const [totalRecords, items] = await Promise.all([
      prisma.feedback.count({ where }),
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    res.json({
      success: true,
      data: {
        feedback: items,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any feedback by Admin
// @route   DELETE /api/admin/feedback/:id
// @access  Private (Admin Only)
const adminDeleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.feedback.findUnique({ where: { id } });
    if (!existing) {
      res.status(404);
      throw new Error('Feedback record not found');
    }

    await prisma.feedback.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Feedback record deleted successfully by administrator',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories with feedback counts for Admin
// @route   GET /api/admin/categories
// @access  Private (Admin Only)
const adminGetCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { feedbacks: true } },
      },
    });
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new category
// @route   POST /api/admin/categories
// @access  Private (Admin Only)
const adminCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      res.status(400);
      throw new Error('Category name is required');
    }

    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      res.status(400);
      throw new Error('A category with this name already exists');
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
      include: { _count: { select: { feedbacks: true } } },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing category name
// @route   PUT /api/admin/categories/:id
// @access  Private (Admin Only)
const adminUpdateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      res.status(400);
      throw new Error('Category name is required');
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      res.status(404);
      throw new Error('Category not found');
    }

    const duplicate = await prisma.category.findFirst({
      where: { name: name.trim(), NOT: { id } },
    });
    if (duplicate) {
      res.status(400);
      throw new Error('Another category already has this name');
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
      include: { _count: { select: { feedbacks: true } } },
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category (with feedback count validation)
// @route   DELETE /api/admin/categories/:id
// @access  Private (Admin Only)
const adminDeleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { feedbacks: true } } },
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    if (category._count.feedbacks > 0) {
      res.status(400);
      throw new Error('Cannot delete: Category has existing feedback');
    }

    await prisma.category.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAdminFeedbackList,
  adminDeleteFeedback,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
};
