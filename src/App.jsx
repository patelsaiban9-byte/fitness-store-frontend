import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";

// Components
import Navbar from "./components/navbar";

// Pages
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Products from "./pages/product";
import Cart from "./pages/cart";
import OrderForm from "./pages/orderform";
import About from "./pages/about";
import ProductDetail from "./pages/ProductDetail";


// Admin pages
import Admin from "./pages/admin";
import AdminOrders from "./pages/adminorder";
import OrderDetail from "./pages/OrderDetail";
import UserReports from "./pages/UserReports";
import AdminReturns from "./pages/AdminReturns";

// ✅ NEW PAGE
import MyOrders from "./pages/MyOrders";

/* ===============================
   ROUTE PROTECTION (OLD LOGIC)
   =============================== */
function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ isLoggedIn, userRole, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (userRole !== "admin") return <Navigate to="/" replace />;
  return children;
}

/* ===============================
   LAYOUT (OLD LOGIC)
   =============================== */
function Layout({
  children,
  isLoggedIn,
  userRole,
  setIsLoggedIn,
  setUserRole,
}) {
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  /* ===============================
     AUTH CHECK (OLD LOGIC)
     =============================== */
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || !role) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          localStorage.removeItem("phone");
          setIsLoggedIn(false);
          setUserRole(null);
        } else {
          setIsLoggedIn(true);
          setUserRole(role);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("phone");
        setIsLoggedIn(false);
        setUserRole(null);
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  /* ===============================
     LOADING SCREEN
     =============================== */
  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Checking authentication...</p>
        </div>
      </div>
    );
  }

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
            element={
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUserRole={setUserRole}
              />
            }
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

          {/* Cart */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* My Orders (USER) */}
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <OrderForm />
              </ProtectedRoute>
            }
          />

          {/* Buy Now - Direct Order */}
          <Route
            path="/buynow"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <OrderForm />
              </ProtectedRoute>
            }
          />

          {/* Order Form (Legacy Route) */}
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <OrderForm />
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
              <AdminRoute
                isLoggedIn={isLoggedIn}
                userRole={userRole}
              >
                <Admin />
              </AdminRoute>
            }
          />

          {/* Admin Orders */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute
                isLoggedIn={isLoggedIn}
                userRole={userRole}
              >
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* Admin Order List (alternative path) */}
          <Route
            path="/adminorder"
            element={
              <AdminRoute
                isLoggedIn={isLoggedIn}
                userRole={userRole}
              >
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* Admin Order Detail */}
          <Route
            path="/adminorder/:id"
            element={
              <AdminRoute
                isLoggedIn={isLoggedIn}
                userRole={userRole}
              >
                <OrderDetail />
              </AdminRoute>
            }
          />

          {/* Admin Reports */}
          <Route
            path="/admin/reports"
            element={
              <AdminRoute
                isLoggedIn={isLoggedIn}
                userRole={userRole}
              >
                <UserReports />
              </AdminRoute>
            }
          />

          {/* Admin Returns */}
          <Route
            path="/admin/returns"
            element={
              <AdminRoute
                isLoggedIn={isLoggedIn}
                userRole={userRole}
              >
                <AdminReturns />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <Navigate
                to={isLoggedIn ? "/" : "/login"}
                replace
              />
            }
          />
          {/* Product Detail Page */}
<Route
  path="/product/:id"
  element={
    <ProtectedRoute isLoggedIn={isLoggedIn}>
      <ProductDetail />
    </ProtectedRoute>
  }
/>

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
