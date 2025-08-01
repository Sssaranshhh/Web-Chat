// controllers/message.controller.js
import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;

  try {
    const newMessage = await Message.create({ sender, receiver, content, timestamp: new Date() });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
