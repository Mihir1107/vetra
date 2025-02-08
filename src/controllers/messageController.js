const pool = require("../config/db");

// ✅ Receive & Store Incoming WhatsApp Messages
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

  try {
    // Store received message in the database
    await pool.query(
      "INSERT INTO messages (sender, message, response) VALUES ($1, $2, $3)",
      [sender, message, replyText]
    );
    console.log("✅ Message saved to database");

    res.status(200).json({
      success: true,
      message: "Message received and response sent.",
      recipient: sender,
      response: replyText,
    });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Failed to store message." });
  }
};

// ✅ Fetch All Messages from Database
exports.getAllMessages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY timestamp DESC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// ✅ Send a Message from UI and Store it in Database
exports.sendMessage = async (req, res) => {
  console.log("📤 Sending message:", req.body);

  if (!req.body.sender || !req.body.message) {
    console.log("❌ Missing sender or message");
    return res.status(400).json({ error: "Missing sender or message" });
  }

  const { sender, message } = req.body;

  // ✅ Auto-reply logic for messages sent from UI
  let replyText = "Hello! How can I assist you?";
  if (message.toLowerCase().includes("shift")) {
    replyText = "Your next shift is on Monday, 9 AM - 5 PM.";
  } else if (message.toLowerCase().includes("leave")) {
    replyText = "You have 2 leave days remaining.";
  }

  try {
    console.log(`📡 Sending message to ${sender}: "${message}"`);
    console.log(`🤖 Auto-reply: "${replyText}"`);

    // ✅ Store the message + response in the database
    const result = await pool.query(
      "INSERT INTO messages (sender, message, response) VALUES ($1, $2, $3) RETURNING *",
      [sender, message, replyText]
    );

    console.log("✅ Message stored:", result.rows[0]); // Debugging output

    // ✅ Send the correct auto-response back to the frontend
    res.status(200).json({ success: true, response: replyText });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
