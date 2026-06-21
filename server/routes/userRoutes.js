const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Route liên quan đến Profile cá nhân (Độc giả đăng nhập)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// Route quản trị người dùng (Chỉ Admin)
router.route("/").get(protect, admin, getAllUsers);
router.route("/:id").delete(protect, admin, deleteUser);

module.exports = router;
