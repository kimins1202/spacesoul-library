const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng mượn phải ít nhất là 1"],
      max: [10, "Số lượng mượn không được vượt quá 10"],
      default: 1,
    },
    borrowDate: {
      type: Date,
      default: null,
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
    copyReserved: {
      type: Boolean,
      default: false,
    },
    returnRequestedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
