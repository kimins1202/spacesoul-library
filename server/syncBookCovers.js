const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");

dotenv.config();

// Các ấn bản đã được đối chiếu thủ công theo tên sách và tác giả trên Open Library.
const verifiedEditions = {
  "Atomic Habits": { olid: "OL26502528M", isbn: "9780735211292", pages: 320 },
  "Tâm Lý Học Về Tiền": { olid: "OL59343619M", isbn: "9780857197689", pages: 256 },
  "Nhà Giả Kim": { olid: "OL32936835M", isbn: "", pages: 208 },
  "Sapiens: Lược Sử Loài Người": { olid: "OL26414386M", isbn: "9780062316097", pages: 443 },
  "Hoàng Tử Bé": { olid: "OL16690339M", isbn: "", pages: 96 },
  "Nhà Đầu Tư Thông Minh": { olid: "OL9233249M", isbn: "", pages: 640 },
  "Đắc Nhân Tâm": { olid: "OL31981288M", isbn: "", pages: 307 }
};

const shelfPrefix = {
  vanhoc: "VH", kynang: "KN", khoahoc: "KH",
  congnghe: "CN", taichinh: "TC", thieunhi: "TN"
};

const sync = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library");
    const books = await Book.find().sort({ category: 1, title: 1 });
    let verifiedCount = 0;

    for (let index = 0; index < books.length; index += 1) {
      const book = books[index];
      const edition = verifiedEditions[book.title];

      if (edition) {
        book.cover = `https://covers.openlibrary.org/b/olid/${edition.olid}-L.jpg`;
        if (edition.isbn) book.isbn = edition.isbn;
        if (edition.pages) book.pages = edition.pages;
        verifiedCount += 1;
      } else if (book.cover?.includes("images.unsplash.com")) {
        // Không tiếp tục dùng ảnh minh họa chung làm bìa sách.
        book.cover = "";
      }

      if (!book.language) book.language = "Tiếng Việt";
      if (!book.shelfLocation) {
        const prefix = shelfPrefix[book.category] || "TL";
        book.shelfLocation = `${prefix}-${String(index + 1).padStart(3, "0")}`;
      }
      await book.save();
    }

    console.log(`Đã cập nhật ${verifiedCount} bìa sách đã xác minh; các sách còn lại dùng bìa chữ đúng tên và tác giả.`);
  } catch (error) {
    console.error(`Không thể đồng bộ ảnh bìa: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

sync();
