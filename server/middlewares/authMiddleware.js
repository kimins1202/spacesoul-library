const User = require("../models/User");
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
      req.user = await User.findById(decoded.id).select("-password");

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

// Middleware kiểm tra quyền admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
};

module.exports = { protect, admin };
