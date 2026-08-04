const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");
const { normalizeCategory } = require("./utils/categories");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library");
    const books = await Book.find();
    let updated = 0;

    for (const book of books) {
      const normalized = normalizeCategory(book.category);
      if (book.category !== normalized) {
        book.category = normalized;
        await book.save();
        updated += 1;
      }
    }

    console.log(`Đã chuẩn hóa danh mục cho ${updated}/${books.length} sách.`);
  } catch (error) {
    console.error(`Không thể chuẩn hóa danh mục: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
