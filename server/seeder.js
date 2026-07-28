const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Employee = require("./models/Employee");
const Reader = require("./models/Reader");
const Book = require("./models/Book");
const Publisher = require("./models/Publisher");
const Borrow = require("./models/Borrow");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library")
  .then(() => console.log("MongoDB Connected for Seeder"))
  .catch((err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  });

const importData = async () => {
  try {
    // 1. Clear database
    await Employee.deleteMany();
    await Reader.deleteMany();
    await Book.deleteMany();
    await Publisher.deleteMany();
    await Borrow.deleteMany();
    
    // Clear the old users table if it exists (not strictly modeled, but we can do it via raw mongoose)
    try {
      await mongoose.connection.collection('users').drop();
      console.log("Old users collection dropped.");
    } catch (e) {
      // Ignore if collection doesn't exist
    }

    console.log("Data Destroyed!");

    // 2. Create Employees (Admin and Staff)
    const admin = await Employee.create({
      firstName: "Admin",
      lastName: "System",
      email: "admin@admin.com",
      password: "password123", // Will be hashed by pre-save hook
      position: "Quản trị hệ thống",
      role: "admin",
      status: "active"
    });

    const staff = await Employee.create({
      firstName: "Staff",
      lastName: "Library",
      email: "staff@staff.com",
      password: "password123",
      position: "Thủ thư",
      role: "staff",
      status: "active"
    });

    // 3. Create Readers
    const reader = await Reader.create({
      firstName: "Nguyễn Văn",
      lastName: "Độc Giả",
      email: "reader@reader.com",
      password: "password123",
      birthDate: "1995-01-01",
      gender: "Nam",
      phone: "0123456789",
      status: "active"
    });

    // 4. Create Publishers
    const nxbTre = await Publisher.create({
      name: "NXB Trẻ",
      address: "161B Lý Chính Thắng, Quận 3, TP.HCM"
    });

    const nxbKimDong = await Publisher.create({
      name: "NXB Kim Đồng",
      address: "55 Quang Trung, Hai Bà Trưng, Hà Nội"
    });

    // 5. Create Books
    await Book.create({
      title: "Tâm Lý Học Về Tiền",
      author: "Morgan Housel",
      category: "taichinh",
      price: 25000,
      totalCopies: 5,
      availableCopies: 5,
      publisher: nxbTre._id,
      publishYear: 2021,
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      description: "Thành công về tài chính không hẳn là một kỹ năng khó. Nó là một kỹ năng mềm, nơi cách bạn cư xử quan trọng hơn những gì bạn biết."
    });

    await Book.create({
      title: "Atomic Habits",
      author: "James Clear",
      category: "kynang",
      price: 30000,
      totalCopies: 10,
      availableCopies: 10,
      publisher: nxbTre._id,
      publishYear: 2020,
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop",
      description: "Thay đổi tí hon, hiệu quả bất ngờ."
    });

    await Book.create({
      title: "Dế Mèn Phiêu Lưu Ký",
      author: "Tô Hoài",
      category: "vanhoc",
      price: 15000,
      totalCopies: 20,
      availableCopies: 20,
      publisher: nxbKimDong._id,
      publishYear: 2018,
      cover: "https://images.unsplash.com/photo-1629196914167-bd1ec06f7b76?q=80&w=400&auto=format&fit=crop",
      description: "Tác phẩm văn học kinh điển dành cho thiếu nhi."
    });

    await Book.insertMany([
      {
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        category: "vanhoc",
        price: 18000,
        totalCopies: 12,
        availableCopies: 8,
        publisher: nxbTre._id,
        publishYear: 2020,
        rating: 4.8,
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
        description: "Hành trình theo đuổi vận mệnh của chàng chăn cừu Santiago và bài học về việc lắng nghe trái tim."
      },
      {
        title: "Muôn Kiếp Nhân Sinh",
        author: "Nguyên Phong",
        category: "kynang",
        price: 28000,
        totalCopies: 8,
        availableCopies: 3,
        publisher: nxbTre._id,
        publishYear: 2021,
        rating: 4.7,
        cover: "https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=600&auto=format&fit=crop",
        description: "Những câu chuyện chiêm nghiệm về nhân quả, lựa chọn và cách mỗi người kiến tạo cuộc sống của mình."
      },
      {
        title: "Lược Sử Thời Gian",
        author: "Stephen Hawking",
        category: "khoahoc",
        price: 32000,
        totalCopies: 7,
        availableCopies: 5,
        publisher: nxbTre._id,
        publishYear: 2018,
        rating: 4.9,
        cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
        description: "Cánh cửa dễ tiếp cận dẫn vào những câu hỏi lớn về vũ trụ, thời gian, hố đen và nguồn gốc tồn tại."
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "congnghe",
        price: 35000,
        totalCopies: 6,
        availableCopies: 4,
        publisher: nxbTre._id,
        publishYear: 2022,
        rating: 4.8,
        cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
        description: "Các nguyên tắc, mẫu tư duy và ví dụ thực tế giúp lập trình viên viết mã rõ ràng, dễ bảo trì."
      },
      {
        title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
        author: "Nguyễn Nhật Ánh",
        category: "vanhoc",
        price: 16000,
        totalCopies: 15,
        availableCopies: 11,
        publisher: nxbKimDong._id,
        publishYear: 2019,
        rating: 4.9,
        cover: "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=600&auto=format&fit=crop",
        description: "Chuyến tàu hồn nhiên trở về thế giới tuổi thơ qua giọng kể dí dỏm, trong trẻo và đầy hoài niệm."
      },
      {
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        category: "kynang",
        price: 22000,
        totalCopies: 10,
        availableCopies: 0,
        publisher: nxbTre._id,
        publishYear: 2021,
        rating: 4.6,
        cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop",
        description: "Những nguyên tắc bền vững giúp thấu hiểu con người, giao tiếp chân thành và xây dựng quan hệ tích cực."
      }
    ]);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
