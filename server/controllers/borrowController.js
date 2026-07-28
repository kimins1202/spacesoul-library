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
    if (!isValidId(bookId)) {
      return res.status(400).json({ message: "Mã sách không hợp lệ" });
    }
    await syncOverdueBorrows();
    // Kiểm tra xem sách có tồn tại không
    const bookRecord = await Book.findById(bookId);
    if (!bookRecord) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    // Kiểm tra xem người dùng có đang mượn sách quá hạn không
    const overdueBorrow = await Borrow.findOne({
      reader: req.user._id,
      status: "overdue",
    });

    if (overdueBorrow) {
      return res
        .status(400)
        .json({ message: "Bạn đang có sách quá hạn không thể mượn thêm" });
    }
    //Giới hạn số lượng mượn sách
    const countBorrows = await Borrow.countDocuments({
      reader: req.user._id,
      status: { $in: ["pending", "borrowing", "pending-return", "overdue"] },
    });
    if (countBorrows >= 10) {
      return res
        .status(400)
        .json({ message: "Bạn đã mượn quá số lượng sách cho phép" });
    }
    //Không gửi yêu cầu mượn sách nếu đã có yêu cầu mượn đang chờ xử lý
    const existingBorrow = await Borrow.findOne({
      reader: req.user._id,
      book: bookId,
      status: { $in: ["pending", "borrowing", "pending-return", "overdue"] },
    });
    if (existingBorrow) {
      return res
        .status(400)
        .json({ message: "Bạn đã gửi yêu cầu mượn sách này" });
    }
    // Giữ chỗ một bản sách ngay khi tạo yêu cầu để số lượng hiển thị chính xác.
    const reservedBook = await Book.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      { returnDocument: "after" }
    );
    if (!reservedBook) {
      return res.status(400).json({ message: "Sách đã hết bản sao khả dụng" });
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
        dueDate: tempDueDate,
        copyReserved: true,
      });
    } catch (error) {
      await Book.updateOne({ _id: bookId }, { $inc: { availableCopies: 1 } });
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
      .populate("book", "title author cover category price publishYear totalCopies availableCopies")
      .populate("employee", "firstName lastName")
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
      .populate("employee", "firstName lastName")
      .populate("book", "title author cover category price publishYear totalCopies availableCopies")
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
      const reservedBook = await Book.findOneAndUpdate(
        { _id: borrow.book, availableCopies: { $gt: 0 } },
        { $inc: { availableCopies: -1 } },
        { returnDocument: "after" }
      );
      if (!reservedBook) {
        return res.status(400).json({ message: "Sách hiện đã hết bản có thể mượn" });
      }
      borrow.copyReserved = true;
    }

    borrow.status = "borrowing";
    borrow.borrowDate = new Date();
    borrow.dueDate = new Date();
    // Thiết lập ngày trả sách là 14 ngày kể từ ngày mượn
    borrow.dueDate.setDate(borrow.borrowDate.getDate() + 14);
    
    // Ghi nhận nhân viên xử lý
    borrow.employee = req.user._id;

    await borrow.save();
    res.status(200).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Yêu cầu trả sách của người dùng
const requestReturnBook = async (req, res) => {
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
    if (borrow.status !== "borrowing" && borrow.status !== "overdue") {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn không ở trạng thái đang mượn" });
    }

    borrow.status = "pending-return";
    await borrow.save();
    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Xác nhận trả sách (Chỉ dành cho Admin)
const confirmReturnBook = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    // Kiểm tra trạng thái yêu cầu mượn
    if (borrow.status !== "pending-return") {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn không ở trạng thái chờ trả" });
    }

    borrow.status = "returned";
    borrow.returnDate = new Date();
    borrow.copyReserved = false;
    // Ghi nhận nhân viên xử lý (có thể ghi đè nhân viên approve)
    borrow.employee = req.user._id;

    await borrow.save();

    const bookRecord = await Book.findById(borrow.book);
    if (bookRecord && bookRecord.availableCopies < bookRecord.totalCopies) {
      bookRecord.availableCopies += 1;
      await bookRecord.save();
    }
    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hủy yêu cầu mượn sách (Chỉ dành cho người dùng)
const cancelBorrowRequest = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã yêu cầu không hợp lệ" });
    }
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    const isOwner = req.userType === "Reader" && borrow.reader.toString() === req.user._id.toString();
    const isEmployee = req.userType === "Employee";
    if (!isOwner && !isEmployee) {
      return res.status(403).json({ message: "Bạn không có quyền hủy yêu cầu này" });
    }
    // Kiểm tra trạng thái yêu cầu mượn
    if (borrow.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn không ở trạng thái chờ duyệt" });
    }

    if (borrow.copyReserved) {
      const bookRecord = await Book.findById(borrow.book);
      if (bookRecord && bookRecord.availableCopies < bookRecord.totalCopies) {
        bookRecord.availableCopies += 1;
        await bookRecord.save();
      }
      borrow.copyReserved = false;
    }

    borrow.status = "cancelled";
    await borrow.save();
    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBorrowRequest,
  getMyBorrows,
  getAllBorrows,
  approveBorrowRequest,
  requestReturnBook,
  confirmReturnBook,
  cancelBorrowRequest,
};
