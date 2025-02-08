import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/messages/all")
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📩 WhatsApp Messages</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
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
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b">
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
      </div>
    </div>
  );
};

export default App;
