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
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold text-primary">📦 My Orders</h2>
          <p className="text-muted">Track and manage all your orders</p>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {orders.map((order) => (
            <div key={order._id} className="card mb-4 shadow-sm border-0">
              {/* CARD HEADER */}
              <div className="card-header bg-light border-bottom">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h6 className="mb-0 fw-bold">
                      Order ID: <span className="text-primary">{order._id.slice(-8).toUpperCase()}</span>
                    </h6>
                    <small className="text-muted">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </small>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <span
                      className={`badge me-2 ${
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

              {/* CARD BODY */}
              <div className="card-body">
                {/* ITEMS */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-secondary">Order Items</h6>
                  {Array.isArray(order.items) &&
                    order.items.map((item, i) => (
                      <div
                        key={i}
                        className="row align-items-center mb-3 pb-3 border-bottom"
                      >
                        <div className="col-2 col-md-1">
                          {/* 🖼️ PRODUCT IMAGE */}
                          <img
                            src={getImageUrl(item.productId?.image || item.image) || undefined}
                            onError={handleImageError}
                            alt={item.productId?.name || item.name}
                            className="img-fluid rounded"
                            style={{
                              objectFit: "cover",
                              aspectRatio: "1",
                              border: "1px solid #e9ecef",
                            }}
                          />
                        </div>
                        <div className="col-7 col-md-8">
                          <p className="mb-0 fw-500">
                            {item.productId?.name || item.name}
                          </p>
                          <small className="text-muted">
                            Quantity: <strong>{item.qty}</strong>
                          </small>
                        </div>
                        <div className="col-3 text-end">
                          <p className="mb-0 fw-bold text-success">
                            ₹{(item.price * item.qty).toFixed(2)}
                          </p>
                          <small className="text-muted">₹{item.price}/item</small>
                        </div>
                      </div>
                    ))}
                </div>

                {/* TOTAL */}
                <div className="row mb-4 pb-3 border-top border-bottom">
                  <div className="col-6 col-md-8 text-end">
                    <h6 className="fw-bold">Total Amount:</h6>
                  </div>
                  <div className="col-6 col-md-4 text-end">
                    <h6 className="fw-bold text-success">₹{order.totalAmount.toFixed(2)}</h6>
                  </div>
                </div>

                {/* TRACKING EVENTS */}
                {Array.isArray(order.trackingEvents) && order.trackingEvents.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3 text-secondary">📍 Tracking Information</h6>
                    <div className="timeline">
                      {order.trackingEvents.map((ev, idx) => (
                        <div key={idx} className="d-flex mb-3">
                          <div className="me-3">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px", minWidth: "32px" }}
                            >
                              <small>✓</small>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-bold">{ev.status}</p>
                            <small className="text-muted d-block">{ev.note}</small>
                            <small className="text-muted">
                              {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : ''}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* INVOICE DOWNLOAD */}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
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
                      ? "📥 Downloading..."
                      : "📄 Download Invoice"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
