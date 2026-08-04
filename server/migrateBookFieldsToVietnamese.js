const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const fieldMap = {
  title: "TenSach",
  author: "TacGia",
  price: "DonGia",
  publishYear: "NamXuatBan",
  publisher: "MaNhaXuatBan",
  category: "TheLoai",
  cover: "AnhBia",
  description: "MoTa",
  totalCopies: "TongSoQuyen",
  availableCopies: "SoQuyenKhaDung",
  rating: "DanhGia",
  isbn: "ISBN",
  pages: "SoTrang",
  language: "NgonNgu",
  shelfLocation: "ViTriKe",
  createdAt: "NgayTao",
  updatedAt: "NgayCapNhat",
};

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const books = mongoose.connection.collection("books");
  const result = await books.updateMany(
    { title: { $exists: true } },
    { $rename: fieldMap }
  );
  console.log(`Đã chuẩn hóa ${result.modifiedCount} sách sang tên trường tiếng Việt.`);
  await mongoose.disconnect();
};

migrate().catch(async error => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
