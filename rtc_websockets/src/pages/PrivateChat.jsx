import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

export default function PrivateChat({ currentUser }) {
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!userId || !currentUser?._id) return;
    const privateRoomId = [currentUser._id, userId].sort().join(":");
    socket.emit("join_room", privateRoomId);

    socket.on("receive_message", (data) => {
      setChat((prev) => [
        ...prev,
        { ...data, sender: data.sender === currentUser._id ? "me" : "them" },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId, currentUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = () => {
    if (message.trim() === "") return;
    const privateRoomId = [currentUser._id, userId].sort().join(":");
    const msgData = {
      roomId: privateRoomId,
      content: message,
      timestamp: new Date().toISOString(),
      sender: currentUser._id,
      receiver: userId,
    };
    socket.emit("send_message", msgData);
    setChat((prev) => [...prev, { ...msgData, sender: "me" }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Chat with {userId}
      </h2>

      <div className="flex-1 overflow-y-auto px-2 py-4 bg-white rounded-xl shadow-inner space-y-2">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-xs text-white ${
                msg.sender === "me" ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
