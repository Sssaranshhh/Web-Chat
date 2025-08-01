import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { Send, AlertTriangle } from "lucide-react";

export default function ChatRoom() {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (roomId) {
      try {
        socket.emit("join_room", roomId);
        socket.on("receive_message", (data) => {
          setChatLog((prev) => [...prev, data]);
        });
      } catch (err) {
        setError("Socket connection failed: " + err.message);
      }
    }

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      try {
        socket.emit("send_message", {
          roomId,
          content: message,
          timestamp: new Date().toISOString(),
        });
        setChatLog((prev) => [...prev, { content: message, sender: "You" }]);
        setMessage("");
      } catch (err) {
        setError("Failed to send message: " + err.message);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-lg overflow-hidden">
      <header className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <h2 className="text-xl font-semibold text-gray-800">
          Chat Room: <span className="text-blue-600 font-bold">{roomId}</span>
        </h2>
      </header>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 flex items-center gap-2">
          <AlertTriangle size={18} />
          <span className="text-sm">Error: {error}</span>
        </div>
      )}

      <div className="h-80 overflow-y-auto px-6 py-4 bg-gray-50">
        {chatLog.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center mt-12">
            No messages yet. Start the conversation!
          </p>
        ) : (
          chatLog.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 max-w-lg ${
                msg.sender === "You"
                  ? "ml-auto text-right"
                  : "mr-auto text-left"
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg shadow ${
                  msg.sender === "You"
                    ? "bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                <p className="text-sm break-words whitespace-pre-wrap">
                  <span className="block font-medium mb-1">
                    {msg.sender || "Anonymous"}
                  </span>
                  {msg.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-6 py-4 border-t bg-white flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
        >
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
}
