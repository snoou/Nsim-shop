import asyncHandler from '../middleware/asyncHandler.js';
import Category from '../models/categoryModel.js';

// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: 'نام دسته‌بندی جدید',
    slug: `sample-slug-${Date.now()}`, 
    image: '/images/sample.jpg', // یک عکس پیش‌فرض
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug, image } = req.body; 
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;
    category.slug = slug; 
    category.image = image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('دسته‌بندی پیدا نشد');
  }
});

// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await Category.deleteOne({ _id: category._id });
    res.json({ message: 'دسته‌بندی با موفقیت حذف شد' });
  } else {
    res.status(404);
    throw new Error('دسته‌بندی پیدا نشد');
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('دسته‌بندی پیدا نشد');
  }
});

export { getCategories, createCategory, updateCategory, deleteCategory , getCategoryById};