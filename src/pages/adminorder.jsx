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
     DELETE FULL ORDER
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

            {/* DELETE */}
            <div style={{ marginTop: "14px", textAlign: "right" }}>
              <button
                onClick={() => handleDelete(order._id)}
                style={{
                  padding: "8px 16px",
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
