const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Reader = require("../models/Reader");
const Employee = require("../models/Employee");

const createBorrowRequest = async (req, res) => {
  try {
    const { bookId } = req.body;
    // Kiểm tra xem sách có tồn tại không
    const bookRecord = await Book.findById(bookId);
    if (!bookRecord) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    // Kiểm tra xem sách có bản sao khả dụng không
    if (bookRecord.availableCopies <= 0) {
      return res.status(400).json({ message: "Sách đã hết bản sao khả dụng" });
    }
    // Kiểm tra xem người dùng có đang mượn sách quá hạn không
    const overdueBorrow = await Borrow.findOne({
      reader: req.user._id,
      book: bookId,
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
      status: { $in: ["pending", "borrowing", "overdue"] },
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
      status: { $in: ["pending", "borrowing", "overdue"] },
    });
    if (existingBorrow) {
      return res
        .status(400)
        .json({ message: "Bạn đã gửi yêu cầu mượn sách này" });
    }
    // Tạo yêu cầu mượn sách mới
    // Tạm set dueDate (sẽ được cập nhật lại khi admin approve)
    const tempDueDate = new Date();
    tempDueDate.setDate(tempDueDate.getDate() + 14);
    const borrow = await Borrow.create({
      reader: req.user._id,
      book: bookId,
      dueDate: tempDueDate,
    });
    res.status(201).json({ message: "Yêu cầu mượn sách thành công", borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách yêu cầu mượn sách của người dùng hiện tại
const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ reader: req.user._id })
      .populate("book", "title author cover category")
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả yêu cầu mượn sách (dành cho Admin)
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("reader", "firstName lastName email")
      .populate("employee", "firstName lastName")
      .populate("book", "title author cover category")
      .sort({ createdAt: -1 });
    res.status(200).json(borrows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Duyệt yêu cầu mượn sách (Chỉ dành cho Admin)
const approveBorrowRequest = async (req, res) => {
  try {
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
    // Kiểm tra xem sách có bản sao khả dụng không
    const bookRecord = await Book.findById(borrow.book);
    if (bookRecord.availableCopies <= 0) {
      return res.status(400).json({ message: "Sách đã hết bản sao khả dụng" });
    }
    // Cập nhật trạng thái yêu cầu mượn và ngày mượn, ngày trả
    borrow.status = "borrowing";
    borrow.borrowDate = new Date();
    borrow.dueDate = new Date();
    // Thiết lập ngày trả sách là 14 ngày kể từ ngày mượn
    borrow.dueDate.setDate(borrow.borrowDate.getDate() + 14);
    
    // Ghi nhận nhân viên xử lý
    borrow.employee = req.user._id;

    await borrow.save();
    bookRecord.availableCopies -= 1;
    await bookRecord.save();
    res.status(200).json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Yêu cầu trả sách của người dùng
const requestReturnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
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
    // Ghi nhận nhân viên xử lý (có thể ghi đè nhân viên approve)
    borrow.employee = req.user._id;

    await borrow.save();

    const bookRecord = await Book.findById(borrow.book);
    bookRecord.availableCopies += 1;
    await bookRecord.save();
    res.json(borrow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hủy yêu cầu mượn sách (Chỉ dành cho người dùng)
const cancelBorrowRequest = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Không tìm thấy yêu cầu mượn" });
    }
    // Kiểm tra trạng thái yêu cầu mượn
    if (borrow.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Yêu cầu mượn không ở trạng thái chờ duyệt" });
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
