const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, employee } = require("../middlewares/authMiddleware");

// Route cho users
router.route("/").get(getBooks);
router.route("/:id").get(getBookById);

// Route cho admin/nhân viên
router.route("/").post(protect, employee, createBook);
router
  .route("/:id")
  .put(protect, employee, updateBook)
  .delete(protect, employee, deleteBook);
module.exports = router;
