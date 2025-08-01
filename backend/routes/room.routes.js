import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

// Get all rooms
router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
});

// Create a new room
router.post("/", async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Room name required" });
    try {
        const room = await Room.create({ name });
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ message: "Room already exists or invalid" });
    }
});

export default router;
