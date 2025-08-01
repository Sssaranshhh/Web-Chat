// controllers/user.controller.js
import User from "../models/User.js";

// Register controller
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// Login controller
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

// Search controller
export const searchUsers = async (req, res) => {
  const search = req.query.q;

  try {
    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};
