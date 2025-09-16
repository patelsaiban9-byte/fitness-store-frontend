import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Updated: use VITE_API_URL from .env for Vite
      const apiUrl = import.meta.env.VITE_API_URL;

      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token + role + email
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);

      setIsLoggedIn(true);
      setUserRole(data.user.role);

      alert("✅ Login Successful");

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
        margin: 0,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>🔐 Login</h2>
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              required
            />
          </div>

          <div
            style={{
              border: "1px solid #007bff",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        </form>

        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#007bff", textDecoration: "none" }}
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
