const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/dashboardController");
const { protect, employee } = require("../middlewares/authMiddleware");

router.route("/").get(protect, employee, getStats);

module.exports = router;
