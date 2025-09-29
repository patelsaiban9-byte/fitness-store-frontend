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
    setIsOpen(false); // close menu on logout
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      {/* Use container-fluid for full width */}
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          onClick={() => setIsOpen(false)}
        >
          🏋️ Health & Fitness
        </Link>

        {/* Toggle button for mobile */}
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

        {/* Collapsible items */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto text-center">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/products"
                    onClick={() => setIsOpen(false)}
                  >
                    Products
                  </Link>
                </li>

                {/* Only normal users can place orders */}
                {userRole !== "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/products"
                      onClick={() => setIsOpen(false)}
                    >
                      Place Order
                    </Link>
                  </li>
                )}

                {/* Admin-specific links */}
                {userRole === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin/orders"
                        onClick={() => setIsOpen(false)}
                      >
                        View Orders
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item mt-2 mt-lg-0">
                  <button
                    className="btn btn-danger ms-lg-3 w-100"
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
                  className="btn btn-success ms-lg-3 w-100"
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
