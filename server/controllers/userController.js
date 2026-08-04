const Reader = require("../models/Reader");
const Admin = require("../models/Admin");
const Borrow = require("../models/Borrow");
const mongoose = require("mongoose");

const isValidId = id => mongoose.isValidObjectId(id);

// ===== READER (ĐỘC GIẢ) OPERATIONS =====

// Lấy thông tin cá nhân của độc giả đang đăng nhập
const getUserProfile = async (req, res) => {
  try {
    // req.user được gán bởi middleware (Reader hoặc Admin)
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      ...(req.userType === 'Reader' && {
        birthDate: user.birthDate,
        gender: user.gender,
        status: user.status,
      }),
      type: req.userType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân của người dùng đang đăng nhập
const updateUserProfile = async (req, res) => {
  try {
    const Model = req.userType === 'Admin' ? Admin : Reader;
    const user = await Model.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật các trường chung
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    // Trường riêng của Reader
    if (req.userType === 'Reader') {
      if (req.body.birthDate !== undefined) user.birthDate = req.body.birthDate;
      if (req.body.gender !== undefined) user.gender = req.body.gender;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        status: updatedUser.status,
        type: req.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== ADMIN OPERATIONS =====

// Lấy danh sách tất cả Độc giả (Chỉ dành cho Admin)
const getAllReaders = async (req, res) => {
  try {
    const readers = await Reader.find().select("-password");
    res.status(200).json(readers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa Độc giả (Chỉ dành cho Admin)
const deleteReader = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã độc giả không hợp lệ" });
    }
    const reader = await Reader.findById(req.params.id);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    const hasBorrowHistory = await Borrow.exists({ reader: req.params.id });
    if (hasBorrowHistory) {
      return res.status(409).json({ message: "Không thể xóa độc giả đã có lịch sử mượn" });
    }
    await Reader.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa độc giả thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllReaders,
  deleteReader,
};

