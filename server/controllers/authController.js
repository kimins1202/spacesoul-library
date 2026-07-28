const Reader = require("../models/Reader");
const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Đăng ký người dùng mới (Mặc định tạo Reader)
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email exists in either Reader or Employee
    const readerExists = await Reader.findOne({ email });
    const employeeExists = await Employee.findOne({ email });
    
    if (readerExists || employeeExists) {
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
      user = await Employee.findOne({ email });
      type = 'Employee';
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Kiểm tra tài khoản bị khóa
    if (user.status === "locked") {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
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
