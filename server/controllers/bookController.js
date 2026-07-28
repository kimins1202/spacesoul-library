const Book = require("../models/Book");

//Lấy danh sách tất cả sách
const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("publisher");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 cuốn sách theo ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("publisher");
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
    const book = await Book.create(req.body);
    res.status(201).json({ message: "Đã thêm sách mới thành công", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sách
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
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
