const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tên sách"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Vui lòng nhập tên tác giả"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Vui lòng nhập thể loại"],
      lowercase: true,
    },
    cover: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    totalCopies: {
      type: Number,
      default: 1,
      min: 0,
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
