const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const readerSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: [true, "Vui lòng nhập họ"],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "Vui lòng nhập tên người dùng"],
      trim: true,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Khác",
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user", // To maintain compatibility with frontend role check
    }
  },
  {
    timestamps: true,
  }
);

readerSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

readerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Reader = mongoose.model("Reader", readerSchema);
module.exports = Reader;
