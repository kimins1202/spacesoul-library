const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");
const Reader = require("./models/Reader");

dotenv.config();

const ensureDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/spacesoul_library");

    const admin = await Admin.findOne({ email: "admin@admin.com" });
    if (admin) {
      admin.password = process.env.DEMO_ADMIN_PASSWORD || "password123";
      await admin.save();
    } else {
      await Admin.create({
        firstName: "Admin",
        lastName: "System",
        email: "admin@admin.com",
        password: process.env.DEMO_ADMIN_PASSWORD || "password123",
        role: "admin",
      });
    }

    const reader = await Reader.findOne({ email: "reader@reader.com" });
    if (reader) {
      reader.password = process.env.DEMO_READER_PASSWORD || "password123";
      await reader.save();
    } else {
      await Reader.create({
        firstName: "Nguyễn Văn",
        lastName: "Độc Giả",
        email: "reader@reader.com",
        password: process.env.DEMO_READER_PASSWORD || "password123",
        birthDate: "1995-01-01",
        gender: "Nam",
        phone: "0123456789",
        status: "active",
      });
    }

    console.log(`Đã cập nhật tài khoản demo trong database ${mongoose.connection.name}.`);
  } catch (error) {
    console.error(`Không thể cập nhật tài khoản demo: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

ensureDemoUsers();
