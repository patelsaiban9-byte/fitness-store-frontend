import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `${API_URL}/${img.replace(/^\/+/, "")}`;
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/80?text=No+Image";
  };

  // ✅ LOGIN STORES userId
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/orders/my/user/${userId}`
        );
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Fetch my orders error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userId, API_URL, navigate]);

  /* ===============================
     LOADING UI
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

            {/* ITEMS (ONLY IMAGE ADDED) */}
            {Array.isArray(order.items) &&
              order.items.map((item, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-center mb-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    {/* 🖼️ PRODUCT IMAGE */}
                    <img
                      src={getImageUrl(item.productId?.image || item.image) || undefined}
                      onError={handleImageError}
                      alt={item.productId?.name || item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />

                    <span>
                      {(item.productId?.name || item.name)} × {item.qty}
                    </span>
                  </div>

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

            {/* INVOICE DOWNLOAD */}
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={async () => {
                  try {
                    setDownloading(order._id);
                    const res = await fetch(
                      `${API_URL}/api/orders/invoice/${order._id}`
                    );
                    if (!res.ok) throw new Error("Failed to download");

                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `invoice-${order._id}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("Invoice download error:", err);
                    alert("Failed to download invoice");
                  } finally {
                    setDownloading(null);
                  }
                }}
                disabled={downloading && downloading !== order._id}
              >
                {downloading === order._id
                  ? "Downloading..."
                  : "Download Invoice"}
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
