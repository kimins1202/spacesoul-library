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
    price: {
      type: Number,
      required: [true, "Vui lòng nhập đơn giá"],
      min: 0,
    },
    publishYear: {
      type: Number,
      required: [true, "Vui lòng nhập năm xuất bản"],
    },
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: [true, "Vui lòng chọn nhà xuất bản"],
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
    isbn: {
      type: String,
      default: "",
      trim: true,
    },
    pages: {
      type: Number,
      default: 0,
      min: 0,
    },
    language: {
      type: String,
      default: "Tiếng Việt",
    },
    shelfLocation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

bookSchema.pre("validate", function () {
  if (this.availableCopies > this.totalCopies) {
    this.invalidate("availableCopies", "Số bản khả dụng không được lớn hơn tổng số bản");
  }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
