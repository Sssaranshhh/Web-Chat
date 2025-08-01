
// import { useState } from "react";
// import { Send, Users, Clock, Lock } from "lucide-react";

// // Mock socket for demonstration - replace with your actual socket import
// const socket = {
//   on: (event, callback) => {
//     // Simulate some messages for demo
//     if (event === "chat-message") {
//       setTimeout(() => callback({ name: "Alice", message: "Hey everyone! 👋", datetime: new Date() }), 1000);
//       setTimeout(() => callback({ name: "Bob", message: "How's everyone doing today?", datetime: new Date() }), 3000);
//       setTimeout(() => callback({ name: "Charlie", message: "Working on some exciting projects!", datetime: new Date() }), 5000);
//     }
//   },
//   off: () => {},
//   emit: () => {}
// };

// // Date formatting function to replace moment.js
// const formatTimeAgo = (date) => {
//   const now = new Date();
//   const diff = Math.floor((now - new Date(date)) / 1000);
//   if (diff < 60) return "just now";
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// };

// function MessageInput({ username }) {
//   const [msg, setMsg] = useState("");
//   const [toUser, setToUser] = useState("");
//   const [isPrivateMode, setIsPrivateMode] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);

//   const sendMessage = () => {
//     if (!msg.trim()) return;

//     const data = {
//       name: username,
//       message: msg,
//       datetime: new Date(),
//     };

//     if (toUser.trim()) {
//       socket.emit("privateMessage", {
//         toUsername: toUser,
//         message: msg,
//         datetime: data.datetime,
//       });
//     } else {
//       socket.emit("newmessage", data);
//     }

//     setMsg("");
//     socket.emit("feedback", { feedback: "" });
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const handleFocus = () => {
//     setIsFocused(true);
//     socket.emit("feedback", { feedback: `${username} is typing...` });
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//     socket.emit("feedback", { feedback: "" });
//   };

//   return (
//     <div className="bg-white border-t border-gray-200 p-4 space-y-3">
//       {/* Private Message Toggle */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => {
//               setIsPrivateMode(!isPrivateMode);
//               if (isPrivateMode) setToUser("");
//             }}
//             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
//               isPrivateMode 
//                 ? 'bg-purple-100 text-purple-700 border border-purple-200' 
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             <Lock size={14} />
//             Private Mode
//           </button>
          
//           {isPrivateMode && (
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span>→</span>
//               <input
//                 type="text"
//                 placeholder="Enter username"
//                 value={toUser}
//                 onChange={(e) => setToUser(e.target.value)}
//                 className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-32"
//               />
//             </div>
//           )}
//         </div>
        
//         {(msg.trim() || toUser.trim()) && (
//           <button
//             onClick={() => {
//               setMsg("");
//               setToUser("");
//               setIsPrivateMode(false);
//             }}
//             className="text-gray-400 hover:text-gray-600 text-sm"
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {/* Main Input Area */}
//       <div className="flex gap-3 items-end">
//         <div className="flex-1 relative">
//           <div className={`relative rounded-xl transition-all duration-200 ${
//             isFocused ? 'ring-2 ring-blue-500 shadow-sm' : 'shadow-sm'
//           }`}>
//             <textarea
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               onKeyPress={handleKeyPress}
//               onFocus={handleFocus}
//               onBlur={handleBlur}
//               placeholder={
//                 isPrivateMode && toUser.trim() 
//                   ? `Send private message to ${toUser}...` 
//                   : "Type your message..."
//               }
//               rows={1}
//               className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:outline-none resize-none transition-all duration-200 text-sm"
//               style={{
//                 minHeight: '44px',
//                 maxHeight: '120px',
//                 overflowY: msg.length > 100 ? 'auto' : 'hidden'
//               }}
//             />
            
//             {/* Character Counter */}
//             {msg.length > 200 && (
//               <div className="absolute bottom-1 left-3 text-xs text-gray-400">
//                 {msg.length}/500
//               </div>
//             )}
//           </div>
          
//           {/* Send Button */}
//           <button
//             onClick={sendMessage}
//             disabled={!msg.trim()}
//             className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
//               msg.trim()
//                 ? isPrivateMode 
//                   ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm' 
//                   : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>

//       {/* Status Indicators */}
//       {isPrivateMode && toUser.trim() && (
//         <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
//           <Lock size={12} />
//           <span>Private message to <strong>{toUser}</strong></span>
//         </div>
//       )}
//     </div>
//   );
// }