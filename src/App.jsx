import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Home from "./pages/home";
import Products from "./pages/product";
import Admin from "./pages/admin";
import OrderForm from "./pages/orderform";
import Register from "./pages/register";
import { useState, useEffect } from "react";

// ✅ Route protection wrappers
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ isLoggedIn, userRole, children }) {
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (userRole !== "admin") return <Navigate to="/" />;
  return children;
}

// ✅ Wrapper to hide Navbar on login/register
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

  // ✅ Keep user logged in on refresh
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

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute isLoggedIn={isLoggedIn} userRole={userRole}>
                <Admin />
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
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
