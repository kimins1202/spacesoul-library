const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Route cho users
router.route("/").get(getBooks);
router.route("/:id").get(getBookById);

// Route dành riêng cho quản trị viên
router.route("/").post(protect, admin, createBook);
router
  .route("/:id")
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);
module.exports = router;
