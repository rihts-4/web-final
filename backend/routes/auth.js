const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, display_name, password } = req.body;

    if (!username || !display_name || !password) {
      return res.status(400).json({ error: "Username, display name, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db
      .prepare("INSERT INTO users (username, display_name, password_hash) VALUES (?, ?, ?)")
      .run(username, display_name, passwordHash);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.lastInsertRowid,
        username,
        display_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;