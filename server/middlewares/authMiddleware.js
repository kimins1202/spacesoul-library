const Reader = require("../models/Reader");
const Admin = require("../models/Admin");
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
      
      if (decoded.type === 'Admin') {
        req.user = await Admin.findOne({ _id: decoded.id, role: "admin" }).select("-password");
        req.userType = 'Admin';
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

const admin = (req, res, next) => {
  if (req.user && req.userType === "Admin" && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập (yêu cầu quản trị viên)" });
  }
};

module.exports = { protect, admin };
