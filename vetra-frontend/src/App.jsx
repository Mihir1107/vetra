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

      setSuccess(response.data.response);
      setMessages([
        ...messages,
        {
          sender,
          message,
          response: response.data.response,
          timestamp: new Date().toISOString(),
        },
      ]);

      setSender("");
      setMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setError("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          📩 Vetra WhatsApp Messages
        </h1>

        {/* Send Message Form */}
        <div className="mb-8 border border-gray-300 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Send a Message
          </h2>
          <form onSubmit={sendMessage} className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Recipient Number (e.g., 919876543210)"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
          {success && <p className="text-green-600 mt-3">{success}</p>}
          {error && <p className="text-red-600 mt-3">{error}</p>}
        </div>

        {/* Messages Table */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Message History
          </h2>
          {loading ? (
            <p className="text-gray-600">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-600">No messages found.</p>
          ) : (
            <table className="w-full border border-gray-300 rounded-md shadow-sm">
              <thead>
                <tr className="bg-blue-600 text-white text-left">
                  <th className="p-4 border border-gray-300">Sender</th>
                  <th className="p-4 border border-gray-300">Message</th>
                  <th className="p-4 border border-gray-300">Response</th>
                  <th className="p-4 border border-gray-300">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 hover:bg-gray-100 transition"
                  >
                    <td className="p-4 border border-gray-300">{msg.sender}</td>
                    <td className="p-4 border border-gray-300">
                      {msg.message}
                    </td>
                    <td className="p-4 border border-gray-300">
                      {msg.response}
                    </td>
                    <td className="p-4 border border-gray-300">
                      {new Date(msg.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
