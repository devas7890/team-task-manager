import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      setUser(res.data.user);

      const dashRes = await axios.get("http://localhost:5000/api/dashboard");
      setDashboard(dashRes.data);
    } catch (err) {
      alert("Login failed");
    }
  };

  const createTask = async () => {
    try {
      await axios.post("http://localhost:5000/api/tasks", {
        title,
        description,
        due_date: "2026-05-10",
        project_id: 1,
        assigned_to: 1,
        created_by: 1,
      });

      alert("Task Created ✅");

      const dashRes = await axios.get("http://localhost:5000/api/dashboard");
      setDashboard(dashRes.data);

      setTitle("");
      setDescription("");
    } catch (err) {
      alert("Error creating task");
    }
  };

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "15px",
  };

  const buttonStyle = {
    padding: "12px 25px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      {!user ? (
        <div style={{ maxWidth: "420px", margin: "80px auto", ...cardStyle }}>
          <h1 style={{ color: "#333", textAlign: "center" }}>
            Team Task Manager
          </h1>
          <p style={{ textAlign: "center", color: "#666" }}>
            Login to manage projects and tasks
          </p>

          <input
            style={inputStyle}
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={inputStyle}
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={{ ...buttonStyle, width: "100%" }} onClick={login}>
            Login
          </button>
        </div>
      ) : (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ ...cardStyle, marginBottom: "25px" }}>
            <h1 style={{ color: "#333" }}>Welcome, {user.name} 👋</h1>
            <p style={{ color: "#666" }}>
              Role: <b>{user.role}</b>
            </p>
          </div>

          <h2 style={{ color: "white" }}>Dashboard</h2>

          {dashboard && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div style={cardStyle}>
                <h3>Total Tasks</h3>
                <h1 style={{ color: "#667eea" }}>{dashboard.total}</h1>
              </div>

              <div style={cardStyle}>
                <h3>Pending</h3>
                <h1 style={{ color: "#f59e0b" }}>{dashboard.pending}</h1>
              </div>

              <div style={cardStyle}>
                <h3>Completed</h3>
                <h1 style={{ color: "#10b981" }}>{dashboard.completed}</h1>
              </div>

              <div style={cardStyle}>
                <h3>Overdue</h3>
                <h1 style={{ color: "#ef4444" }}>{dashboard.overdue}</h1>
              </div>
            </div>
          )}

          <div style={cardStyle}>
            <h2 style={{ color: "#333" }}>Create New Task</h2>

            <input
              style={inputStyle}
              value={title}
              placeholder="Task Title"
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              style={{ ...inputStyle, height: "90px" }}
              value={description}
              placeholder="Task Description"
              onChange={(e) => setDescription(e.target.value)}
            />

            <button style={buttonStyle} onClick={createTask}>
              Create Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;