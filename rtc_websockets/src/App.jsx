
import Home from "./pages/Home";

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import PrivateChat from "./pages/PrivateChat";

import { Navigate } from "react-router-dom";

function PrivateChatWrapper() {
  const location = useLocation();
  const currentUser = location.state?.currentUser || { username: "Guest", _id: "guest" };
  return <PrivateChat currentUser={currentUser} />;
}

function AppRoutes() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <Home
            currentUser={{ username: "Guest", _id: "guest" }}
            onSelectUser={(user) => navigate(`/private/${user._id}`, { state: { currentUser: { username: "Guest", _id: "guest" } } })}
            onJoinRoom={(room) => navigate(`/room/${room._id}`)}
          />
        } />
        <Route path="/room/:roomId" element={<ChatRoom />} />
        <Route path="/private/:userId" element={<PrivateChatWrapper />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
