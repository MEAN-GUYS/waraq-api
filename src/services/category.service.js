const { status: httpStatus } = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createCategory = async (name) => {
  try {
    return await Category.create({ name });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.CONFLICT, 'Category name already exists');
    } else {
      throw error;
    }
  }
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
  Object.assign(category, { name });

  try {
    await category.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.CONFLICT, 'Category name already exists');
    }
    throw error;
  }

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
