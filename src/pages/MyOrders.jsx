import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ✅ FIX: phone use karo (backend isi se filter karta hai)
  const phone = localStorage.getItem("phone");

  useEffect(() => {
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
        setOrders(data);
      } catch (err) {
        console.error("Fetch my orders error:", err);
      }
    };

    fetchMyOrders();
  }, [phone, API_URL, navigate]);

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

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">📦 My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="mb-2 text-muted">
              Order Date:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>

            <hr />

            {order.items.map((item, i) => (
              <div
                key={i}
                className="d-flex justify-content-between mb-2"
              >
                <span>
                  {item.productId?.name} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fw-bold text-success">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>

            <div className="mt-2">
              <span className="badge bg-warning text-dark">
                {order.status || "Pending"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
