import { useEffect, useState } from "react";
import { Search, Users, Plus, DoorOpen } from "lucide-react";

const Home = ({ currentUser, onSelectUser, onJoinRoom }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => setError(err.message));

    fetch("http://localhost:4000/api/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return res.json();
      })
      .then(setRooms)
      .catch((err) => setError(err.message));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) &&
      user.username !== currentUser.username
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl space-y-8">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded flex items-center gap-2">
          <span>⚠️</span>
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, {currentUser.username} 👋
      </h1>

      {/* Search Users Section */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <Search size={20} /> Search Users to Chat Privately
        </h2>
        <input
          type="text"
          placeholder="Type a username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <ul className="mt-4 divide-y border rounded-lg bg-gray-50">
          {filteredUsers.length === 0 ? (
            <li className="text-gray-500 p-4 text-center">No users found.</li>
          ) : (
            filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => onSelectUser(user)}
                className="p-4 hover:bg-blue-50 cursor-pointer"
              >
                {user.username}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Join or Create Room Section */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <Users size={20} /> Join or Create a Chat Room
        </h2>

        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => onJoinRoom(room)}
              className="w-full text-left px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition"
            >
              {room.name}
            </button>
          ))}
        </div>

        <form
          className="mt-6 flex flex-col sm:flex-row gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const name = e.target.roomName.value.trim();
            if (!name) return;

            const res = await fetch("http://localhost:4000/api/rooms", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
            });

            if (res.ok) {
              const newRoom = await res.json();
              setRooms((prev) => [...prev, newRoom]);
              onJoinRoom(newRoom);
            } else {
              alert("Room already exists or is invalid.");
            }

            e.target.reset();
          }}
        >
          <input
            type="text"
            name="roomName"
            placeholder="Enter room name"
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Plus size={16} /> Create
            </button>
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                const form = e.target.form;
                const name = form.roomName.value.trim();
                if (!name) return;

                const res = await fetch("http://localhost:4000/api/rooms");
                const allRooms = await res.json();
                const found = allRooms.find((r) => r.name === name);
                if (found) {
                  onJoinRoom(found);
                } else {
                  alert("Room not found.");
                }
              }}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <DoorOpen size={16} /> Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
