const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const mongoose = require("mongoose");

const syncOverdueBorrows = () => Borrow.updateMany(
  { status: "borrowing", dueDate: { $lt: new Date() } },
  { $set: { status: "overdue" } }
);

const isValidId = id => mongoose.isValidObjectId(id);

const createBorrowRequest = async (req, res) => {
  try {
    if (req.userType !== "Reader") {
      return res.status(403).json({ message: "Chỉ độc giả mới có thể gửi yêu cầu mượn sách" });
    }
    const { bookId } = req.body;
    const quantity = Number(req.body.quantity ?? 1);
    if (!isValidId(bookId)) {
      return res.status(400).json({ message: "Mã sách không hợp lệ" });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return res.status(400).json({ message: "Số lượng mượn phải là số nguyên từ 1 đến 10" });
    }
    await syncOverdueBorrows();
    // Kiểm tra xem sách có tồn tại không
    const bookRecord = await Book.findById(bookId);
    if (!bookRecord) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    // Giới hạn tổng số bản sách đang được giữ/mượn của một độc giả.
    const activeQuantity = await Borrow.aggregate([
      {
        $match: {
          reader: req.user._id,
          status: { $in: ["pending", "borrowing", "pending-return", "overdue"] },
        },
      },
      { $group: { _id: null, total: { $sum: { $ifNull: ["$quantity", 1] } } } },
    ]);
    const borrowedCopies = activeQuantity[0]?.total || 0;
    if (borrowedCopies + quantity > 10) {
      return res
        .status(400)
        .json({ message: `Bạn chỉ có thể giữ tối đa 10 quyển (hiện đang có ${borrowedCopies})` });
    }
    // Có thể tạo nhiều phiếu cho cùng một đầu sách; giới hạn được tính theo
    // tổng số quyển đang hoạt động và số lượng còn trong kho.
    // Giữ chỗ đúng số lượng ngay khi tạo yêu cầu để tránh mượn vượt tồn kho.
    const reservedBook = await Book.findOneAndUpdate(
      { _id: bookId, SoQuyenKhaDung: { $gte: quantity } },
      { $inc: { SoQuyenKhaDung: -quantity } },
      { returnDocument: "after" }
    );
    if (!reservedBook) {
      return res.status(400).json({ message: `Không đủ ${quantity} quyển sách khả dụng` });
    }

    // Tạo yêu cầu mượn sách mới
    // Tạm set dueDate (sẽ được cập nhật lại khi admin approve)
    const tempDueDate = new Date();
    tempDueDate.setDate(tempDueDate.getDate() + 14);
    let borrow;
    try {
      borrow = await Borrow.create({
        reader: req.user._id,
        book: bookId,
        quantity,
        dueDate: tempDueDate,
        copyReserved: true,
      });
    } catch (error) {
      await Book.updateOne({ _id: bookId }, { $inc: { SoQuyenKhaDung: quantity } });
      throw error;
    }
    res.status(201).json({ message: "Yêu cầu mượn sách thành công", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách yêu cầu mượn sách của người dùng hiện tại
const getMyBorrows = async (req, res) => {
  try {
    if (req.userType !== "Reader") {
      return res.status(403).json({ message: "Chỉ độc giả mới có lịch sử mượn cá nhân" });
    }
    await syncOverdueBorrows();
    const borrows = await Borrow.find({ reader: req.user._id })
      .populate("book", "TenSach TacGia AnhBia TheLoai DonGia NamXuatBan TongSoQuyen SoQuyenKhaDung")
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả yêu cầu mượn sách (dành cho Admin)
const getAllBorrows = async (req, res) => {
  try {
    await syncOverdueBorrows();
    const borrows = await Borrow.find()
      .populate("reader", "firstName lastName email")
      .populate("book", "TenSach TacGia AnhBia TheLoai DonGia NamXuatBan TongSoQuyen SoQuyenKhaDung")
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Duyệt yêu cầu mượn sách (Chỉ dành cho Admin)
const approveBorrowRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    // Kiểm tra trạng thái yêu cầu mượn
    if (borrow.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn đã được xử lý trước đó" });
    }
    // Cập nhật trạng thái yêu cầu mượn và ngày mượn, ngày trả
    if (!borrow.copyReserved) {
      const quantity = borrow.quantity || 1;
      const reservedBook = await Book.findOneAndUpdate(
        { _id: borrow.book, SoQuyenKhaDung: { $gte: quantity } },
        { $inc: { SoQuyenKhaDung: -quantity } },
        { returnDocument: "after" }
      );
      if (!reservedBook) {
        return res.status(400).json({ message: `Không đủ ${quantity} quyển sách để duyệt yêu cầu` });
      }
      borrow.copyReserved = true;
    }

    borrow.status = "borrowing";
    borrow.borrowDate = new Date();
    borrow.dueDate = new Date();
    // Thiết lập ngày trả sách là 14 ngày kể từ ngày mượn
    borrow.dueDate.setDate(borrow.borrowDate.getDate() + 14);
    
    await borrow.save();
    res.status(200).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Độc giả gửi yêu cầu trả; tồn kho chỉ được cập nhật sau khi quản trị viên nhận sách.
const requestBookReturn = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    await syncOverdueBorrows();
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    if (req.userType !== "Reader" || borrow.reader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền trả phiếu mượn này" });
    }
    // Kiểm tra trạng thái yêu cầu mượn
    if (!["borrowing", "overdue"].includes(borrow.status)) {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn không ở trạng thái đang mượn" });
    }

    borrow.status = "pending-return";
    borrow.returnRequestedAt = new Date();
    await borrow.save();

    res.status(200).json({ message: "Đã gửi yêu cầu trả sách", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmBookReturn = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    if (borrow.status !== "pending-return") {
      return res.status(400).json({ message: "Phiếu mượn chưa có yêu cầu trả đang chờ xác nhận" });
    }

    const shouldRestoreCopy = borrow.copyReserved;
    borrow.status = "returned";
    borrow.returnDate = new Date();
    borrow.copyReserved = false;
    await borrow.save();

    if (shouldRestoreCopy) {
      await Book.updateOne(
        { _id: borrow.book },
        [{ $set: { SoQuyenKhaDung: { $min: ["$TongSoQuyen", { $add: ["$SoQuyenKhaDung", borrow.quantity || 1] }] } } }],
        { updatePipeline: true }
      );
    }

    res.status(200).json({ message: "Đã xác nhận nhận lại sách", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Độc giả hủy phiếu của mình hoặc quản trị viên từ chối phiếu đang chờ duyệt.
const cancelBorrowRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    const isOwner = req.userType === "Reader"
      && borrow.reader.toString() === req.user._id.toString();
    const isAdmin = req.userType === "Admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Bạn không có quyền hủy yêu cầu này" });
    }
    // Kiểm tra trạng thái yêu cầu mượn
    if (borrow.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn không ở trạng thái chờ duyệt" });
    }

    if (borrow.copyReserved) {
      await Book.updateOne(
        { _id: borrow.book },
        [{ $set: { SoQuyenKhaDung: { $min: ["$TongSoQuyen", { $add: ["$SoQuyenKhaDung", borrow.quantity || 1] }] } } }],
        { updatePipeline: true }
      );
      borrow.copyReserved = false;
    }

    borrow.status = "cancelled";
    await borrow.save();
    res.status(200).json({ message: "Đã hủy yêu cầu mượn", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBorrowRequest,
  getMyBorrows,
  getAllBorrows,
  approveBorrowRequest,
  requestBookReturn,
  confirmBookReturn,
  cancelBorrowRequest,
};
