import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/messages/all")
      .then((response) => {
        setMessages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching messages:", error);
        setError("Failed to load messages.");
        setLoading(false);
      });
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!sender || !message) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/messages/send",
        {
          sender,
          message,
        }
      );

      console.log("📤 Message Sent Successfully:", response.data); // Debugging log

      // ✅ Show success message
      setSuccess(response.data.response);

      // ✅ Instantly update the messages table
      setMessages([
        ...messages,
        {
          sender,
          message,
          response: "Sent successfully",
          timestamp: new Date().toISOString(),
        },
      ]);

      // ✅ Clear input fields
      setSender("");
      setMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setError("Failed to send message. Check console for details.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📩 WhatsApp Messages</h1>

      {/* Message Sending Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-2">Send a Message</h2>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            className="w-full p-2 mb-2 border rounded"
            placeholder="Recipient Number (e.g., 919876543210)"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 border rounded"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send Message
          </button>
        </form>
        {success && <p className="text-green-500 mt-2">{success}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Sender</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Response</th>
                <th className="p-2 border">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 border">{msg.sender}</td>
                  <td className="p-2 border">{msg.message}</td>
                  <td className="p-2 border">{msg.response}</td>
                  <td className="p-2 border">
                    {new Date(msg.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default App;
