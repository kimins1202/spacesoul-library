const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllReaders,
  deleteReader,
} = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Hồ sơ cá nhân của độc giả và quản trị viên
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ===== READER (ĐỘC GIẢ) ROUTES - Chỉ quản trị viên =====
router.route("/readers").get(protect, admin, getAllReaders);
router.route("/readers/:id").delete(protect, admin, deleteReader);

module.exports = router;

