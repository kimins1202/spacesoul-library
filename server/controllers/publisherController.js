const asyncHandler = require("express-async-handler");
const Publisher = require("../models/Publisher");

// @desc    Get all publishers
// @route   GET /api/publishers
// @access  Public
const getPublishers = asyncHandler(async (req, res) => {
  const publishers = await Publisher.find({});
  res.json(publishers);
});

module.exports = {
  getPublishers,
};
