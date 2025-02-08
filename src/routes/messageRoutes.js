const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// ✅ Route to get all messages
router.get("/all", messageController.getAllMessages);

module.exports = router;
