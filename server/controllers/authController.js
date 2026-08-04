const Reader = require("../models/Reader");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Đăng ký người dùng mới (Mặc định tạo Reader)
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Email không được trùng giữa độc giả và quản trị viên.
    const readerExists = await Reader.findOne({ email });
    const adminExists = await Admin.findOne({ email, role: "admin" });
    
    if (readerExists || adminExists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const user = await Reader.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        type: 'Reader'
      },
      token: generateToken(user._id, 'Reader'),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Reader.findOne({ email });
    let type = 'Reader';
    
    if (!user) {
      user = await Admin.findOne({ email, role: "admin" });
      type = 'Admin';
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        type: type
      },
      token: generateToken(user._id, type),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
