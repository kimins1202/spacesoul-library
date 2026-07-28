const Reader = require("../models/Reader");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type === 'Employee') {
        req.user = await Employee.findById(decoded.id).select("-password");
        req.userType = 'Employee';
      } else {
        req.user = await Reader.findById(decoded.id).select("-password");
        req.userType = 'Reader';
      }

      if (!req.user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Không có token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Middleware kiểm tra quyền employee (tất cả nhân viên)
const employee = (req, res, next) => {
  if (req.user && req.userType === "Employee") {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập (yêu cầu nhân viên)" });
  }
};

// Middleware kiểm tra quyền admin (chỉ admin)
const admin = (req, res, next) => {
  if (req.user && req.userType === "Employee" && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập (yêu cầu quản trị viên)" });
  }
};

module.exports = { protect, employee, admin };
