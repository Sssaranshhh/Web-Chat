import { useEffect, useState, useRef } from "react";
import { Send, Users, Clock, Lock } from "lucide-react";
import socket from "../utils/socket";
import { formatTimeAgo } from "../utils/formatTimeAgo";

function MessageInput({ username }) {
  const [msg, setMsg] = useState("");
  const [toUser, setToUser] = useState("");
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const sendMessage = () => {
    if (msg.trim()) {
      socket.emit("message", {
        message: isPrivateMode ? `(Private) ${msg}` : msg,
        name: username,
        to: isPrivateMode ? toUser : null,
        datetime: new Date(),
      });
      setMsg("");
      if (isPrivateMode) setToUser("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border-t border-gray-200 p-4 space-y-4 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPrivateMode(!isPrivateMode);
              if (isPrivateMode) setToUser("");
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              isPrivateMode
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Lock size={14} />
            Private
          </button>

          {isPrivateMode && (
            <input
              type="text"
              placeholder="To: username"
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
              className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}
        </div>

        {(msg.trim() || toUser.trim()) && (
          <button
            onClick={() => {
              setMsg("");
              setToUser("");
              setIsPrivateMode(false);
            }}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder={
            isPrivateMode && toUser.trim()
              ? `Private message to ${toUser}...`
              : "Type a message..."
          }
          rows={1}
          className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg resize-none text-sm shadow-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
          style={{
            minHeight: "44px",
            maxHeight: "120px",
            overflowY: msg.length > 100 ? "auto" : "hidden",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!msg.trim()}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition ${
            msg.trim()
              ? isPrivateMode
                ? "bg-purple-500 hover:bg-purple-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send size={18} />
        </button>
      </div>

      {isPrivateMode && toUser.trim() && (
        <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-2 rounded-md">
          <Lock size={12} />
          Sending private message to <strong>{toUser}</strong>
        </div>
      )}
    </div>
  );
}

function ChatRoom({ username = "You", room = "General" }) {
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("feedback", (data) => {
      setFeedback(data);
      setTimeout(() => setFeedback(""), 3000);
    });

    return () => {
      socket.off("message");
      socket.off("feedback");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMessageStyle = (msg) => {
    if (msg.name === username) {
      return "ml-auto bg-blue-500 text-white";
    }
    return "mr-auto bg-white/90 border border-gray-200";
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-blue-100 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">#{room}</h2>
              <p className="text-sm text-gray-500">
                Logged in as <strong>{username}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium">Welcome to #{room}!</p>
            <p className="text-sm">Start a conversation 👇</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.name === username ? "justify-end" : "justify-start"
              } animate-fade-in`}
              style={{
                animation: `fadeInUp 0.3s ease-out ${i * 0.1}s both`,
              }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-md ${getMessageStyle(
                  msg
                )}`}
              >
                {msg.name !== username && (
                  <div className="flex items-center gap-2 mb-1 text-xs font-medium text-gray-600">
                    {msg.message.includes("(Private)") && (
                      <Lock size={12} className="text-purple-600" />
                    )}
                    {msg.name}
                  </div>
                )}
                <p className="text-sm break-words whitespace-pre-wrap">
                  {msg.message}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock size={10} />
                  {formatTimeAgo(msg.datetime)}
                </div>
              </div>
            </div>
          ))
        )}

        {feedback && (
          <div className="flex justify-center">
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm animate-pulse">
              {feedback}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput username={username} />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeInUp 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}

export default ChatRoom;
