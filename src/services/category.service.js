const { status: httpStatus } = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createCategory = async (name) => {
  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'Category name already exists');
  }
  return Category.create({ name });
};

const queryCategories = async (filter, options) => {
  return Category.paginate(filter, options);
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};

const updateCategoryById = async (id, name) => {
  const category = await getCategoryById(id);

  const existing = await Category.findOne({ name, _id: { $ne: id } });
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'Category name already exists');
  }

  Object.assign(category, { name });
  await category.save();
  return category;
};

const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);
  await category.deleteOne();
  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
