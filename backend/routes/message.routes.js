import express from "express";
import { Message } from "../models/Message.js";

const router = express.Router();

router.get("/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort({ timestamp: 1 });

  res.json(messages);
});

export default router;
