import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchUser() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedName = username.trim();
    if (trimmedName) {
      const privateRoomId = [trimmedName, "me"].sort().join("-");
      navigate(`/private/${privateRoomId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-100 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          🔎 Find a User
        </h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to start chat"
          className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Start Private Chat
        </button>
      </div>
    </div>
  );
}
