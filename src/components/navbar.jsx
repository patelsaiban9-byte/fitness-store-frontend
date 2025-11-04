import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, userRole, setIsLoggedIn, setUserRole }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
    setIsOpen(false);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top w-100"
      style={{ zIndex: 1060, width: "100%", margin: 0, padding: 0 }}
    >
      <div className="container-fluid px-3 px-md-4" style={{ width: "100%", maxWidth: "100%" }}>
        <Link
          className="navbar-brand fw-bolder fs-5 d-flex align-items-center"
          to="/"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-warning me-2 fs-4">💪</span> Health & Fitness Store
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto mb-0 align-items-center">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white text-uppercase fw-semibold mx-1"
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white text-uppercase fw-semibold mx-1"
                    to="/products"
                    onClick={() => setIsOpen(false)}
                  >
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-white text-uppercase fw-semibold mx-1"
                    to="/about"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                </li>

                {userRole === "admin" && (
                  <>
                    <li className="nav-item me-lg-2">
                      <Link
                        className="nav-link text-warning fw-bolder mx-1"
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="bi bi-gear-fill me-1"></i> Admin
                      </Link>
                    </li>

                    {/* 🟢 NEW: User Reports link for admin */}
                    <li className="nav-item me-lg-2">
                      <Link
                        className="nav-link text-warning fw-bolder mx-1"
                        to="/admin/reports"
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="bi bi-bar-chart-fill me-1"></i> Reports
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button
                    className="btn btn-danger fw-bold ms-lg-2 px-3"
                    onClick={handleLogout}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="btn btn-warning fw-bold text-dark ms-lg-2 px-3"
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
