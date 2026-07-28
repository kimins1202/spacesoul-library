const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Book = require("./models/Book");
const Publisher = require("./models/Publisher");

dotenv.config();

const catalog = [
  ["Nhà Giả Kim", "Paulo Coelho", "vanhoc", 18000, 2020, 12, "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop", "Hành trình theo đuổi vận mệnh và học cách lắng nghe trái tim."],
  ["Cho Tôi Xin Một Vé Đi Tuổi Thơ", "Nguyễn Nhật Ánh", "vanhoc", 16000, 2019, 15, "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=600&auto=format&fit=crop", "Chuyến tàu trong trẻo trở về thế giới tuổi thơ đầy hồn nhiên."],
  ["Tôi Thấy Hoa Vàng Trên Cỏ Xanh", "Nguyễn Nhật Ánh", "vanhoc", 18000, 2019, 14, "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop", "Câu chuyện về tuổi thơ, tình anh em và những rung động đầu đời."],
  ["Muôn Kiếp Nhân Sinh", "Nguyên Phong", "kynang", 28000, 2021, 8, "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=600&auto=format&fit=crop", "Những chiêm nghiệm về nhân quả, lựa chọn và cách kiến tạo cuộc sống."],
  ["Tuổi Trẻ Đáng Giá Bao Nhiêu", "Rosie Nguyễn", "kynang", 19000, 2020, 12, "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop", "Chia sẻ thực tế về học tập, trải nghiệm và cách chủ động xây dựng tương lai."],
  ["Lược Sử Thời Gian", "Stephen Hawking", "khoahoc", 32000, 2018, 7, "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop", "Cánh cửa dễ tiếp cận dẫn vào những câu hỏi lớn về vũ trụ và thời gian."],
  ["Sapiens: Lược Sử Loài Người", "Yuval Noah Harari", "khoahoc", 38000, 2022, 9, "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop", "Khái quát hành trình của nhân loại từ săn bắt hái lượm đến xã hội hiện đại."],
  ["Clean Code", "Robert C. Martin", "congnghe", 35000, 2022, 6, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop", "Các nguyên tắc giúp lập trình viên viết mã rõ ràng và dễ bảo trì."],
  ["Trí Tuệ Nhân Tạo: Cuộc Cách Mạng Mới", "Kai-Fu Lee", "congnghe", 34000, 2023, 8, "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop", "Góc nhìn thực tế về trí tuệ nhân tạo, việc làm và tương lai con người."],
  ["Hoàng Tử Bé", "Antoine de Saint-Exupéry", "thieunhi", 14000, 2021, 18, "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop", "Tác phẩm giàu chất thơ về tình bạn, tình yêu và trách nhiệm."],
  ["Kính Vạn Hoa", "Nguyễn Nhật Ánh", "thieunhi", 16000, 2020, 16, "https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=600&auto=format&fit=crop", "Những câu chuyện học đường vui nhộn xoay quanh tình bạn và trưởng thành."],
  ["Nhà Đầu Tư Thông Minh", "Benjamin Graham", "taichinh", 42000, 2021, 7, "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop", "Nền tảng của đầu tư giá trị, quản trị rủi ro và kỷ luật tài chính."]
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library");
    const publisher = await Publisher.findOneAndUpdate(
      { name: "NXB Trẻ" },
      { $setOnInsert: { name: "NXB Trẻ", address: "161B Lý Chính Thắng, Quận 3, TP.HCM" } },
      { returnDocument: "after", upsert: true }
    );

    for (const [title, author, category, price, publishYear, totalCopies, cover, description] of catalog) {
      await Book.updateOne(
        { title, author },
        {
          $setOnInsert: {
            title, author, category, price, publishYear, totalCopies,
            availableCopies: totalCopies, publisher: publisher._id, cover, description
          }
        },
        { upsert: true }
      );
    }

    console.log(`Đã đồng bộ ${catalog.length} đầu sách mà không xóa dữ liệu hiện có.`);
  } catch (error) {
    console.error(`Không thể bổ sung sách: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
