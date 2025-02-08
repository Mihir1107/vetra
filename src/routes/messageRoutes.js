const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// ✅ Receive & Store Incoming Message
router.post("/webhook", messageController.receiveMessage);

// ✅ Get All Messages
router.get("/all", messageController.getAllMessages);

// ✅ Send a Message from UI
router.post("/send", messageController.sendMessage);

module.exports = router;
