import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ===============================
     FETCH ALL ORDERS
     =============================== */
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===============================
     DELETE ORDER
     =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await fetch(`${API_URL}/api/orders/${id}`, {
        method: "DELETE",
      });
      alert("Order deleted");
      fetchOrders();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete order");
    }
  };

  /* ===============================
     UPDATE PAYMENT STATUS
     =============================== */
  const updatePaymentStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/payment/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!res.ok) {
        alert("Failed to update payment status");
        return;
      }

      alert("✅ Payment status updated");
      fetchOrders();
    } catch (err) {
      console.error("Payment update error:", err);
      alert("Error updating payment");
    }
  };

  /* ===============================
     🧾 DOWNLOAD INVOICE (NEW)
     =============================== */
  const downloadInvoice = (orderId) => {
    window.open(
      `${API_URL}/api/orders/invoice/${orderId}`,
      "_blank"
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>📦 Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "14px",
              marginBottom: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            }}
          >
            {/* CUSTOMER INFO */}
            <div style={{ marginBottom: "12px" }}>
              <strong>👤 Customer:</strong> {order.customer?.name} <br />
              <strong>📞 Phone:</strong> {order.customer?.phone} <br />
              <strong>📍 Address:</strong> {order.customer?.address} <br />
              <strong>🏷️ Pincode:</strong> {order.customer?.pincode}
            </div>

            <hr />

            {/* ITEMS */}
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <hr />

            {/* TOTAL */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#15803d",
              }}
            >
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>

            {/* PAYMENT INFO */}
            <div
              style={{
                marginTop: "10px",
                fontSize: "14px",
                background: "#f9fafb",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <div>
                <strong>💳 Payment Method:</strong>{" "}
                {order.paymentMethod || "COD"}
              </div>

              <div>
                <strong>📌 Payment Status:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color:
                      order.paymentStatus === "PAID"
                        ? "#16a34a"
                        : order.paymentStatus === "FAILED"
                        ? "#dc2626"
                        : "#ca8a04",
                  }}
                >
                  {order.paymentStatus || "PENDING"}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updatePaymentStatus(order._id, "PAID")}
                  style={btnGreen}
                >
                  Mark Paid
                </button>

                <button
                  onClick={() => updatePaymentStatus(order._id, "FAILED")}
                  style={btnRed}
                >
                  Mark Failed
                </button>

                {/* 🧾 INVOICE BUTTON (NEW) */}
                <button
                  onClick={() => downloadInvoice(order._id)}
                  style={btnBlue}
                >
                  Download Invoice
                </button>
              </div>
            </div>

            {/* DELETE */}
            <div style={{ marginTop: "14px", textAlign: "right" }}>
              <button onClick={() => handleDelete(order._id)} style={btnRed}>
                Delete Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ===============================
   BUTTON STYLES
   =============================== */
const btnGreen = {
  padding: "6px 12px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnRed = {
  padding: "6px 12px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const btnBlue = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminOrders;
