const pool = require("../config/db");
const mockGupshupService = require("../services/mockGupshupService");

exports.receiveMessage = async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  if (!req.body.sender || !req.body.message) {
    return res.status(400).json({ error: "Missing sender or message" });
  }

  const { sender, message } = req.body;

  // Auto-reply logic
  let replyText = "Hello! How can I assist you?";
  if (message.toLowerCase().includes("shift")) {
    replyText = "Your next shift is on Monday, 9 AM - 5 PM.";
  } else if (message.toLowerCase().includes("leave")) {
    replyText = "You have 2 leave days remaining.";
  }

  // Save message to PostgreSQL
  try {
    await pool.query(
      "INSERT INTO messages (sender, message, response) VALUES ($1, $2, $3)",
      [sender, message, replyText]
    );
    console.log("✅ Message saved to database");
  } catch (err) {
    console.error("❌ Database error:", err);
  }

  // Simulated WhatsApp response
  const response = await mockGupshupService.sendWhatsAppMessage(
    sender,
    replyText
  );
  res.status(200).json(response);
};
