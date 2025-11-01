import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Home from "./pages/home";
import Products from "./pages/product";
import Admin from "./pages/admin";
import AdminOrders from "./pages/adminorder";
import OrderForm from "./pages/orderform";
import Register from "./pages/register";
import About from "./pages/about";
import UserReports from "./pages/UserReports"; // ✅ Added correctly

import { useState, useEffect } from "react";

// ✅ Route protection wrappers
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ isLoggedIn, userRole, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (userRole !== "admin") return <Navigate to="/" replace />;
  return children;
}

// ✅ Wrapper to hide Navbar on login/register pages
function Layout({ children, isLoggedIn, userRole, setIsLoggedIn, setUserRole }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && (
        <Navbar
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      )}
      <div className="container mt-4">{children}</div>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      <Layout
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        setIsLoggedIn={setIsLoggedIn}
        setUserRole={setUserRole}
      >
        <Routes>
          {/* Login / Register */}
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />}
          />
          <Route path="/register" element={<Register />} />

          {/* Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Products */}
          <Route
            path="/products"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Products />
              </ProtectedRoute>
            }
          />

          {/* About */}
          <Route
            path="/about"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <About />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
                <Admin />
              </AdminRoute>
            }
          />

          {/* Admin Orders */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* ✅ User Reports Page */}
          <Route
            path="/admin/reports"
            element={
              <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
                <UserReports />
              </AdminRoute>
            }
          />

          {/* Order Form */}
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <OrderForm />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
