const mongoose = require("mongoose");
const { normalizeCategory } = require("../utils/categories");

const bookSchema = new mongoose.Schema(
  {
    TenSach: { type: String, alias: "title", required: [true, "Vui lòng nhập tên sách"], trim: true },
    TacGia: { type: String, alias: "author", required: [true, "Vui lòng nhập tên tác giả"], trim: true },
    DonGia: { type: Number, alias: "price", required: [true, "Vui lòng nhập đơn giá"], min: 0 },
    NamXuatBan: { type: Number, alias: "publishYear", required: [true, "Vui lòng nhập năm xuất bản"] },
    MaNhaXuatBan: {
      type: mongoose.Schema.Types.ObjectId,
      alias: "publisher",
      ref: "Publisher",
      required: [true, "Vui lòng chọn nhà xuất bản"],
    },
    TheLoai: { type: String, alias: "category", required: true, set: normalizeCategory },
    AnhBia: { type: String, alias: "cover", default: "" },
    MoTa: { type: String, alias: "description", default: "" },
    TongSoQuyen: { type: Number, alias: "totalCopies", default: 1, min: 0 },
    SoQuyenKhaDung: { type: Number, alias: "availableCopies", default: 1, min: 0 },
    DanhGia: { type: Number, alias: "rating", default: 0 },
    ISBN: { type: String, alias: "isbn", default: "", trim: true },
    SoTrang: { type: Number, alias: "pages", default: 0, min: 0 },
    NgonNgu: { type: String, alias: "language", default: "Tiếng Việt" },
    ViTriKe: { type: String, alias: "shelfLocation", default: "", trim: true },
  },
  {
    timestamps: { createdAt: "NgayTao", updatedAt: "NgayCapNhat" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookSchema.virtual("MaSach").get(function () {
  return this._id;
});

bookSchema.pre("validate", function () {
  if (this.SoQuyenKhaDung > this.TongSoQuyen) {
    this.invalidate("SoQuyenKhaDung", "Số quyển khả dụng không được lớn hơn tổng số quyển");
  }
});

module.exports = mongoose.model("Book", bookSchema);
