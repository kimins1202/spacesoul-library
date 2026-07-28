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
const { protect, employee } = require("../middlewares/authMiddleware");

// Route cho độc giả tự quản lý mượn trả
router.route("/").post(protect, createBorrowRequest);
router.route("/myborrows").get(protect, getMyBorrows);
router.route("/:id/cancel").put(protect, cancelBorrowRequest);
router.route("/:id/return").put(protect, requestReturnBook);

// Route cho admin/nhân viên duyệt mượn / nhận trả sách
router.route("/").get(protect, employee, getAllBorrows);
router.route("/:id/approve").put(protect, employee, approveBorrowRequest);
router.route("/:id/confirm-return").put(protect, employee, confirmReturnBook);

module.exports = router;
