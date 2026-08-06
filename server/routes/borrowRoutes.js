const express = require("express");
const router = express.Router();
const {
  createBorrowRequest,
  getMyBorrows,
  getAllBorrows,
  approveBorrowRequest,
  requestBookReturn,
  confirmBookReturn,
  cancelBorrowRequest,
} = require("../controllers/borrowController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Route cho độc giả tự quản lý mượn trả
router.route("/").post(protect, createBorrowRequest);
router.route("/myborrows").get(protect, getMyBorrows);
router.route("/:id/cancel").put(protect, cancelBorrowRequest);
router.route("/:id/request-return").put(protect, requestBookReturn);
router.route("/:id/confirm-return").put(protect, admin, confirmBookReturn);

// Route cho quản trị viên duyệt yêu cầu mượn
router.route("/").get(protect, admin, getAllBorrows);
router.route("/:id/approve").put(protect, admin, approveBorrowRequest);

module.exports = router;
