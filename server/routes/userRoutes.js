const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllReaders,
  getAllEmployees,
  deleteReader,
  deleteEmployee,
  toggleReaderStatus,
  createEmployee,
} = require("../controllers/userController");
const { protect, admin, employee } = require("../middlewares/authMiddleware");

// Route liên quan đến Profile cá nhân (cả Reader lẫn Employee đều dùng chung)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// ===== READER (ĐỘC GIẢ) ROUTES - Cho phép tất cả nhân viên =====
router.route("/readers").get(protect, employee, getAllReaders);
router.route("/readers/:id").delete(protect, employee, deleteReader);
router.route("/readers/:id/toggle-status").put(protect, employee, toggleReaderStatus);

// ===== EMPLOYEE (NHÂN VIÊN) ROUTES - Chỉ Admin =====
router.route("/employees").get(protect, admin, getAllEmployees).post(protect, admin, createEmployee);
router.route("/employees/:id").delete(protect, admin, deleteEmployee);

module.exports = router;

