import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../assets/logo";

function Navbar({ isLoggedIn, userRole, setIsLoggedIn, setUserRole }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Cart count state
  const [cartCount, setCartCount] = useState(0);

  /* ===============================
     READ CART COUNT FROM localStorage
     =============================== */
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce(
        (sum, item) => sum + item.qty,
        0
      );
      setCartCount(totalQty);
    };

    updateCartCount();

    // Listen for cart changes (other tabs / updates)
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
    setIsOpen(false);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top">
      <div className="container-fluid px-3 px-md-4">
        {/* BRAND */}
        <Link
          className="navbar-brand fw-bolder fs-5 d-flex align-items-center gap-2"
          to="/"
          onClick={() => setIsOpen(false)}
          style={{ textDecoration: 'none', color: 'white', transition: 'all 0.3s ease' }}
        >
          <Logo size={40} />
          <span className="d-none d-sm-inline">Health & Fitness Store</span>
          <span className="d-sm-none fs-6">FitHub</span>
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={isOpen ? "true" : "false"}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINKS */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            {isLoggedIn && (
              <>
                {/* HOME */}
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-semibold mx-1"
                    to="/"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </li>

                {/* PRODUCTS */}
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-semibold mx-1"
                    to="/products"
                    onClick={() => setIsOpen(false)}
                  >
                    Products
                  </Link>
                </li>

                {/* 🛒 CART (USER ONLY) */}
                {userRole !== "admin" && (
                  <li className="nav-item position-relative">
                    <Link
                      className="nav-link text-white fw-semibold mx-1"
                      to="/cart"
                      onClick={() => setIsOpen(false)}
                    >
                      🛒 Cart
                      {cartCount > 0 && (
                        <span
                          className="badge bg-warning text-dark ms-1"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {/* 📦 MY ORDERS (USER ONLY) */}
                {userRole !== "admin" && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-white fw-semibold mx-1"
                      to="/my-orders"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                  </li>
                )}

                {/* ABOUT */}
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-semibold mx-1"
                    to="/about"
                    onClick={() => setIsOpen(false)}
                  >
                    About Us
                  </Link>
                </li>

                {/* ADMIN LINKS */}
                {userRole === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bolder mx-1"
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link text-warning fw-bolder mx-1"
                        to="/admin/reports"
                        onClick={() => setIsOpen(false)}
                      >
                        Reports
                      </Link>
                    </li>
                  </>
                )}

                {/* LOGOUT */}
                <li className="nav-item">
                  <button
                    className="btn btn-danger fw-bold ms-lg-2 px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* LOGIN */}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  className="btn btn-warning fw-bold text-dark ms-lg-2 px-3"
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
