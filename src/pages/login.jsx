import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

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

      // ✅ Persist user identifiers for client-side requests
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("phone", data.user.phone);
      localStorage.setItem("name", data.user.name);

      // 🛒 Clear cart on login (each user has their own cart)
      localStorage.removeItem("cart");

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
    <div className="auth-page">
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side */}
          <div className="auth-side auth-side-left">
            <div className="auth-branding">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to your account to continue</p>
              <div className="auth-features">
                <div className="feature">
                  <span>✓</span> Access Your Account
                </div>
                <div className="feature">
                  <span>✓</span> Track Your Orders
                </div>
                <div className="feature">
                  <span>✓</span> Exclusive Deals
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-side auth-side-right">
            <div className="auth-form-wrapper">
              <div className="auth-form-header">
                <h3 className="auth-form-title">Sign In</h3>
              </div>

              {error && (
                <div className="alert alert-danger text-center mb-3">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">✉️</span>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      className="form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-button">
                  Sign In
                </button>
              </form>

              <div className="auth-divider">or</div>

              <p className="auth-link">
                Don't have an account?{" "}
                <Link to="/register" className="link-primary">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

