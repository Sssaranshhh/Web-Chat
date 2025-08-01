import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./db.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import roomRoutes from "./routes/room.routes.js";
import { socketHandler } from "./socket/socketHandler.js";

const app = express();
const server = http.createServer(app);

// ✅ Only one correct socket.io server setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Match your frontend
    methods: ["GET", "POST"]
  }
});

// ✅ Connect DB
connectDB();

// ✅ Middlewares
app.use(cors()); // Add cors middleware for REST APIs too
app.use(express.json());

// ✅ REST API Routes
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);

// ✅ Socket.IO
socketHandler(io);

// ✅ Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
