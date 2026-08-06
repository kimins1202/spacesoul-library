const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// connect database
connectDB();

// middleware
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(origin => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isAllowedOrigin = origin => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, "");
  if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // Allow the production alias and Vercel preview deployments of this project.
  return /^https:\/\/spacesoul-library(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(normalizedOrigin);
};

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS rejected origin: ${origin}`);
    return callback(new Error("Origin không được CORS cho phép"));
  },
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Library API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
