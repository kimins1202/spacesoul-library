const express = require("express");
const router = express.Router();
const {
  createBorrowRequest,
  getMyBorrows,
  getAllBorrows,
  approveBorrowRequest,
  requestReturnBook,
  confirmReturnBook,
  cancelBorrowRequest,
} = require("../controllers/borrowController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Route cho độc giả tự quản lý mượn trả
router.route("/").post(protect, createBorrowRequest);
router.route("/myborrows").get(protect, getMyBorrows);
router.route("/:id/cancel").put(protect, cancelBorrowRequest);
router.route("/:id/return").put(protect, requestReturnBook);

// Route cho admin duyệt mượn / nhận trả sách
router.route("/").get(protect, admin, getAllBorrows);
router.route("/:id/approve").put(protect, admin, approveBorrowRequest);
router.route("/:id/confirm-return").put(protect, admin, confirmReturnBook);

module.exports = router;
