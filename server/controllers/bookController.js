const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const mongoose = require("mongoose");

const isValidId = id => mongoose.isValidObjectId(id);
const hasValidInventory = ({ totalCopies, availableCopies }) => (
  Number(totalCopies) >= 0
  && Number(availableCopies) >= 0
  && Number(availableCopies) <= Number(totalCopies)
);

//Lấy danh sách tất cả sách
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("MaNhaXuatBan");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 cuốn sách theo ID
const getBookById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã sách không hợp lệ" });
    }
    const book = await Book.findById(req.params.id).populate("MaNhaXuatBan");
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Tạo sách mới
const createBook = async (req, res) => {
  try {
    const totalCopies = Number(req.body.totalCopies ?? 1);
    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      return res.status(400).json({ message: "Tổng số sách phải là số nguyên lớn hơn 0" });
    }
    // Sách vừa nhập kho chưa có bản nào được mượn, nên số khả dụng luôn bằng tổng số.
    const book = await Book.create({
      ...req.body,
      totalCopies,
      availableCopies: totalCopies,
    });
    res.status(201).json({ message: "Đã thêm sách mới thành công", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sách
const updateBook = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã sách không hợp lệ" });
    }
    const currentBook = await Book.findById(req.params.id);
    if (!currentBook) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    const totalCopies = req.body.totalCopies ?? currentBook.totalCopies;
    const availableCopies = req.body.availableCopies ?? currentBook.availableCopies;
    if (!hasValidInventory({ totalCopies, availableCopies })) {
      return res.status(400).json({ message: "Số bản khả dụng phải từ 0 đến tổng số bản" });
    }
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      translateAliases: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json({ message: "Cập nhật sách thành công", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sách
const deleteBook = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Mã sách không hợp lệ" });
    }
    const hasBorrowHistory = await Borrow.exists({ book: req.params.id });
    if (hasBorrowHistory) {
      return res.status(409).json({ message: "Không thể xóa sách đã có lịch sử mượn" });
    }
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }
    res.status(200).json({ message: "Đã xóa sách thành công", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
