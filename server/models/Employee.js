const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: [true, "Vui lòng nhập họ lót"],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "Vui lòng nhập tên nhân viên"],
      trim: true,
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
    position: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "locked"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    }
  },
  {
    timestamps: true,
  }
);

employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
