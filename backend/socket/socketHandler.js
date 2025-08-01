import { Message } from "../models/Message.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on("send_message", async (data) => {
      // data: { roomId, content, timestamp, sender, receiver }
      const msg = await Message.create({
        sender: data.sender || "anonymous",
        receiver: data.receiver || data.roomId,
        content: data.content,
        timestamp: data.timestamp,
      });
      io.to(data.roomId).emit("receive_message", msg);
    });

    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
    });
  });
};
