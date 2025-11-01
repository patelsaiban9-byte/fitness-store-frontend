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
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top"
      style={{ zIndex: 1060 }}
    >
      <div className="container-fluid px-4">
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
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

                <li className="nav-item mt-2 mt-lg-0">
                  <button
                    className="btn btn-danger fw-bold ms-lg-3 w-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isLoggedIn && (
              <li className="nav-item mt-2 mt-lg-0">
                <Link
                  className="btn btn-warning fw-bold text-dark ms-lg-3 w-100"
                  to="/login"
                  onClick={() => setIsOpen(false)}
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
