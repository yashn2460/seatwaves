const { categoryService } = require("../services");
const { sendResponse } = require("../utils/responseHandler");

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    sendResponse(res, 200, "Categories retrieved successfully", { categories });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return sendResponse(res, 404, "Category not found");
    }
    sendResponse(res, 200, "Category retrieved successfully", { category });
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
}; 