import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 FIX
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ LOGIN KE TIME SAVE HUA PHONE
  const phone = localStorage.getItem("phone");

  useEffect(() => {
    console.log("📞 PHONE FROM LOCALSTORAGE:", phone);

    // 🔐 user login nahi hai to login page
    if (!phone) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/orders/my/${phone}`
        );

        const data = await res.json();
        console.log("📦 ORDERS FROM API:", data);

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Fetch my orders error:", err);
        setOrders([]);
      } finally {
        setLoading(false); // 🔥 FIX
      }
    };

    fetchMyOrders();
  }, [phone, API_URL, navigate]);

  /* ===============================
     LOADING UI  🔥 NEW
     =============================== */
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading your orders...</h4>
      </div>
    );
  }

  /* ===============================
     NO ORDERS UI
     =============================== */
  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No orders yet 📦</h3>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/products")}
        >
          Shop Now
        </button>
      </div>
    );
  }

  /* ===============================
     ORDERS UI
     =============================== */
  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📦 My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="card mb-4 shadow-sm">
          <div className="card-body">

            {/* DATE */}
            <div className="mb-2 text-muted">
              Order Date:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </div>

            <hr />

            {/* ITEMS */}
            {Array.isArray(order.items) &&
              order.items.map((item, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {(item.productId?.name || item.name)} × {item.qty}
                  </span>
                  <span>
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}

            <hr />

            {/* TOTAL */}
            <div className="d-flex justify-content-between fw-bold text-success">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>

            {/* STATUS */}
            <div className="mt-3 d-flex gap-2 flex-wrap">
              <span
                className={`badge ${
                  order.paymentStatus === "PAID"
                    ? "bg-success"
                    : order.paymentStatus === "FAILED"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                💳 {order.paymentStatus || "PENDING"}
              </span>

              <span className="badge bg-info text-dark">
                📦 {order.orderStatus || "PLACED"}
              </span>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
