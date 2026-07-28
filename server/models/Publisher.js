const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên nhà xuất bản"],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Vui lòng nhập địa chỉ nhà xuất bản"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Publisher = mongoose.model("Publisher", publisherSchema);

module.exports = Publisher;
