const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Vui lòng chỉ định ngày phải trả"],
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "borrowing",
        "pending-return",
        "returned",
        "overdue",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
