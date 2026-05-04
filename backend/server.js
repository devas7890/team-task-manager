
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "member"]
    );

    res.json({ message: "User Registered ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login error" });
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, created_by } = req.body;

    await db.query(
      "INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)",
      [name, description, created_by]
    );

    res.json({ message: "Project created ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating project" });
  }
});
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, due_date, project_id, assigned_to, created_by } = req.body;

    await db.query(
  "INSERT INTO tasks (title, description, due_date, project_id, assigned_to, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
  [title, description, due_date, project_id, assigned_to, created_by, "pending"]
);

    res.json({ message: "Task created ✅" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating task" });
  }
});
app.get("/api/tasks", async (req, res) => {
  try {
    const [tasks] = await db.query("SELECT * FROM tasks");
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});
app.get("/api/dashboard", async (req, res) => {
  try {
    const [total] = await db.query("SELECT COUNT(*) AS count FROM tasks");

    const [pending] = await db.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE status = 'pending'"
    );

    const [completed] = await db.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE status = 'completed'"
    );

    const [overdue] = await db.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE due_date < CURDATE() AND status != 'completed'"
    );

    res.json({
      total: total[0].count,
      pending: pending[0].count,
      completed: completed[0].count,
      overdue: overdue[0].count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Dashboard error" });
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});