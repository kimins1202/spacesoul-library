const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const Reader = require("../models/Reader");

const getStats = asyncHandler(async (req, res) => {
  await Borrow.updateMany(
    { status: "borrowing", dueDate: { $lt: new Date() } },
    { $set: { status: "overdue" } }
  );
  const requestedDays = Number.parseInt(req.query.days, 10);
  const days = requestedDays === 30 ? 30 : 7;
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - (days - 1));

  const [
    totalBooks,
    pendingRequests,
    activeUsers,
    recentBorrows,
    rawBorrowTrend,
    rawStatusDistribution,
    inventory
  ] = await Promise.all([
    Book.countDocuments(),
    Borrow.countDocuments({ status: "pending" }),
    Reader.countDocuments(),
    Borrow.find()
      .populate("reader", "firstName lastName")
      .populate("book", "TenSach TacGia AnhBia")
      .sort({ createdAt: -1 })
      .limit(5),
    Borrow.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Ho_Chi_Minh"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Borrow.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Book.aggregate([
      {
        $group: {
          _id: null,
          totalCopies: { $sum: "$TongSoQuyen" },
          availableCopies: { $sum: "$SoQuyenKhaDung" }
        }
      }
    ])
  ]);

  const countByDate = new Map(rawBorrowTrend.map(item => [item._id, item.count]));
  const borrowTrend = Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
    return { date: key, count: countByDate.get(key) || 0 };
  });

  const statusDistribution = rawStatusDistribution.reduce((result, item) => {
    result[item._id] = item.count;
    return result;
  }, {});

  res.json({
    totalBooks,
    pendingRequests,
    activeUsers,
    recentBorrows,
    borrowTrend,
    statusDistribution,
    inventory: inventory[0] || { totalCopies: 0, availableCopies: 0 }
  });
});

module.exports = { getStats };
