const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reader",
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
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
  },
  {
    timestamps: true,
  },
);

const Borrow = mongoose.model("Borrow", borrowSchema);

module.exports = Borrow;
