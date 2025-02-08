require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const messageRoutes = require("./src/routes/messageRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Load API routes
app.use("/api/messages", messageRoutes);

// ✅ Fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("✅ Vetra Backend API is Running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
