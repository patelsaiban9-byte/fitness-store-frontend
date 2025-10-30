import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Reusing the Toast component structure for consistent feedback
const Toast = ({ message, type, show, onClose }) => {
  if (!show) return null;

  const alertClass = {
    success: 'alert-success',
    danger: 'alert-danger',
    warning: 'alert-warning',
  }[type] || 'alert-info';

  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade show fixed-top mx-auto mt-3`}
      role="alert"
      style={{ width: '90%', maxWidth: '500px', zIndex: 1050 }}
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
};

function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // State for Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Function to show toast message
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  // ✅ Updated: use VITE_API_URL from .env for Vite
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("❌ Please enter a valid email address.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("❌ Phone number must be exactly 10 digits.");
      return false;
    }

    if (password.length < 6) {
      setError("❌ Password must be at least 6 characters long.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Use setError for form-based errors
        setError(data.message || "Registration failed");
        return;
      }

      // Replaced alert() with showToast()
      showToast("✅ Registration Successful! Please login.", "success");
      
      // Navigate after a short delay to allow toast to show briefly
      setTimeout(() => {
          navigate("/login");
      }, 1000);
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    // Centered horizontally and vertically using d-flex, min-vh-100, etc.
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
        
      <div
        // Container for the form, styled as a card
        className="card shadow-lg border-0 p-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-success">📝 Register</h3>
        
        {/* Bootstrap Alert for error message */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter 10 digit phone number"
              maxLength="10"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 fw-bold"
          >
            Create Account
          </button>
        </form>
        
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="fw-semibold text-decoration-none text-success"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;