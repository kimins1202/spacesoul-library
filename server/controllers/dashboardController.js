const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const Reader = require("../models/Reader");

const getStats = asyncHandler(async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const pendingRequests = await Borrow.countDocuments({ status: "pending" });
  const activeUsers = await Reader.countDocuments();
  
  const recentBorrows = await Borrow.find()
    .populate("reader", "firstName lastName")
    .populate("book", "title cover")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalBooks,
    pendingRequests,
    activeUsers,
    recentBorrows
  });
});

module.exports = { getStats };
