const express = require("express");
const router = express.Router();
const { getPublishers } = require("../controllers/publisherController");

router.route("/").get(getPublishers);

module.exports = router;
