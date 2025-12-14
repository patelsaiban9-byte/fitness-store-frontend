import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Helper component for the Bootstrap Toast
const Toast = ({ message, type, show, onClose }) => {
  if (!show) return null;

  const alertClass = {
    success: "alert-success",
    danger: "alert-danger",
    warning: "alert-warning",
  }[type] || "alert-info";

  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade show fixed-top mx-auto mt-3`}
      role="alert"
      style={{ width: "90%", maxWidth: "500px", zIndex: 1050 }}
    >
      {message}
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Close"
      ></button>
    </div>
  );
};

function Login({ setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setToast({ show: false, message: "", type: "info" });

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

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

      // 🔐 EXISTING LOGIC (UNCHANGED)
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);

      // ✅ ONLY NEW LINE ADDED (DO NOT REMOVE)
      localStorage.setItem("phone", data.user.phone);

      setIsLoggedIn(true);
      setUserRole(data.user.role);

      showToast("✅ Login Successful", "success");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div
        className="card shadow-lg border-0 p-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">
          🔐 Welcome Back!
        </h3>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
          >
            Sign In
          </button>
        </form>

        <p className="mt-3 text-center">
          New user?{" "}
          <Link
            to="/register"
            className="fw-semibold text-decoration-none text-primary"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
