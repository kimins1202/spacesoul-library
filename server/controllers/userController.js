const Reader = require("../models/Reader");
const Employee = require("../models/Employee");
const Borrow = require("../models/Borrow");
const mongoose = require("mongoose");

const isValidId = id => mongoose.isValidObjectId(id);

// ===== READER (ĐỘC GIẢ) OPERATIONS =====

// Lấy thông tin cá nhân của độc giả đang đăng nhập
const getUserProfile = async (req, res) => {
  try {
    // req.user được gán bởi middleware (có thể là Reader hoặc Employee)
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
      ...(req.userType === 'Employee' && {
        position: user.position,
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
    let Model = req.userType === 'Employee' ? Employee : Reader;
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

    // Trường riêng của Employee
    if (req.userType === 'Employee') {
      if (req.body.position !== undefined) user.position = req.body.position;
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

// Lấy danh sách tất cả Nhân viên (Chỉ dành cho Admin)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json(employees);
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

// Xóa Nhân viên (Chỉ dành cho Admin)
const deleteEmployee = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã nhân viên không hợp lệ" });
    }
    // Không cho phép xóa chính mình
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Không thể xóa chính tài khoản của bạn" });
    }
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    const hasHandledBorrows = await Borrow.exists({ employee: req.params.id });
    if (hasHandledBorrows) {
      return res.status(409).json({ message: "Không thể xóa nhân viên đã xử lý phiếu mượn" });
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa nhân viên thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Khóa / Mở khóa tài khoản Độc giả (Admin)
const toggleReaderStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã độc giả không hợp lệ" });
    }
    const reader = await Reader.findById(req.params.id);
    if (!reader) {
      return res.status(404).json({ message: "Không tìm thấy độc giả" });
    }
    reader.status = reader.status === "active" ? "locked" : "active";
    await reader.save();
    res.status(200).json({ message: `Tài khoản đã được ${reader.status === 'active' ? 'mở khóa' : 'khóa'}`, reader });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mới Nhân viên (Admin)
const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, position, phone, address } = req.body;

    const readerExists = await Reader.findOne({ email });
    const employeeExists = await Employee.findOne({ email });
    if (readerExists || employeeExists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      password,
      position,
      phone,
      address,
    });

    res.status(201).json({
      message: "Tạo nhân viên thành công",
      employee: {
        _id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        position: employee.position,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllReaders,
  getAllEmployees,
  deleteReader,
  deleteEmployee,
  toggleReaderStatus,
  createEmployee,
};

