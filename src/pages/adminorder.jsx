import React, { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  // ✅ Use Vite env variable
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all orders from backend
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

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Order deleted");
        fetchOrders(); // refresh list
      } else {
        alert(data.error || "Failed to delete order");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Address</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Phone</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pincode</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Product</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ textAlign: "center" }}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.name}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.address}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.phone}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{order.pincode}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.productId ? order.productId.name : "Product deleted"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {order.productId ? `₹${order.productId.price}` : "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleDelete(order._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminOrders;
