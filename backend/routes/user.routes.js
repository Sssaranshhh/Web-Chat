// routes/user.routes.js
import express from "express";
import { registerUser, loginUser, searchUsers } from "../controllers/user.controller.js";

const router = express.Router();


// Signup - POST /api/users/register
router.post("/register", registerUser);

// Login - POST /api/users/login
router.post("/login", loginUser);

// Get all users - GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await (await import("../models/User.js")).default.find({}, "username");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Search - GET /api/users/search?q=username
router.get("/search", searchUsers);

export default router;
