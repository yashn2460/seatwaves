const Category = require("../models/category.model");

/**
 * Get all categories
 * @returns {Promise<Category[]>}
 */
const getAllCategories = async () => {
  return Category.find().sort({ name: 1 });
};

/**
 * Get category by id
 * @param {string} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return Category.findOne({ id });
};

module.exports = {
  getAllCategories,
  getCategoryById,
}; 