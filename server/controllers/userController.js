const User = require("../models/User");

//Lấy thông tin cá nhân của người dùng
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      memberCode: user.memberCode,
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Cập nhật thông tin cá nhân của người dùng
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Chỉ cho phép cập nhật các trường được phép
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        memberCode: updatedUser.memberCode,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc    Lấy danh sách tất cả người dùng (Chỉ dành cho Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//xóa người dùng (Chỉ dành cho Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    // Không cho phép xóa chính mình
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Không thể xóa chính tài khoản của bạn" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
