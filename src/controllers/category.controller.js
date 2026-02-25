const { status: httpStatus } = require('http-status');
const { categoryService } = require('../services');
const pick = require('../utils/pick');

const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body.name);
  res.status(httpStatus.CREATED).send(category);
};

const getCategories = async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const categories = await categoryService.queryCategories(filter, options);

  res.status(httpStatus.OK).send(categories);
};

const getCategory = async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  res.send(category);
};

const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body.name);
  res.send(category);
};

const deleteCategory = async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
