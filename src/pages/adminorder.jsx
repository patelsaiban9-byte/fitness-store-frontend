import React, { useEffect, useState } from "react";

/**
 * AdminOrders
 * Main React component for the admin order management page.
 * - Fetches and displays all orders from the backend.
 * - Provides actions to update payment status, update order status,
 *   download invoices and delete orders.
 * - Enforces valid status transitions before sending updates.
 */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ===============================
     STATUS TRANSITION VALIDATION
     =============================== */
  const validTransitions = {
    "PLACED": ["CONFIRMED", "CANCELLED"],
    "CONFIRMED": ["SHIPPED", "CANCELLED"],
    "SHIPPED": ["OUT_FOR_DELIVERY", "CANCELLED"],
    "OUT_FOR_DELIVERY": ["DELIVERED", "CANCELLED"],
    "DELIVERED": ["RETURNED"],
    "CANCELLED": [],
    "RETURNED": [],
  };

  /**
   * canUpdateStatus
   * Determine whether an order may transition from `currentStatus` to `newStatus`.
   * Returns `true` when the transition is allowed per `validTransitions` map.
   */
  const canUpdateStatus = (currentStatus, newStatus) => {
    if (!currentStatus) return true;
    const allowed = validTransitions[currentStatus] || [];
    return allowed.includes(newStatus);
  };

  /**
   * getAllowedNextStates
   * Return the list of allowed next statuses for a given `currentStatus`.
   * Used to inform the admin which transitions are valid.
   */
  const getAllowedNextStates = (currentStatus) => {
    return validTransitions[currentStatus] || [];
  };

  /* ===============================
     FETCH ALL ORDERS
     =============================== */
  /**
   * fetchOrders
   * Fetch all orders from the API and update component state (`orders`).
   * Called on mount and after mutations to refresh the list.
   */
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
  /**
   * handleDelete
   * Delete an order by `id` after user confirmation, then refresh list.
   */
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
  /**
   * updatePaymentStatus
   * Patch the payment status for order `id` to `status` (e.g., PAID, FAILED).
   * Alerts the user on success/failure and refreshes the orders list.
   */
  const updatePaymentStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/payment/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Failed: ${error.error || error.message}`);
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
     UPDATE ORDER STATUS (VALIDATED)
     =============================== */
  /**
   * updateOrderStatus
   * Validate the requested status transition from `currentStatus` to `status`.
   * If valid, send a patch to update the order status and refresh the list.
   */
  const updateOrderStatus = async (id, status, currentStatus) => {
    if (!canUpdateStatus(currentStatus, status)) {
      const allowed = getAllowedNextStates(currentStatus);
      alert(`❌ Cannot change from ${currentStatus} to ${status}.\nAllowed: ${allowed.join(", ") || "None"}`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: `${status} via admin UI` }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Invalid: ${error.error}`);
        return;
      }

      alert("✅ Order status updated");
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error updating order status");
    }
  };

  /* ===============================
     DOWNLOAD INVOICE
     =============================== */
  /**
   * downloadInvoice
   * Open the invoice PDF for `orderId` in a new browser tab/window.
   */
  const downloadInvoice = (orderId) => {
    window.open(`${API_URL}/api/orders/invoice/${orderId}`, "_blank");
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold">
              <span style={{ fontSize: "2.5rem" }}>📦</span> Order Management
            </h1>
            <p className="text-muted fs-6">Manage orders and update payment/shipping status</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <h5>No orders found.</h5>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order._id} className="col-12">
                <div className="card shadow-sm border-0" style={{ borderTop: "4px solid #2563eb" }}>
                  {/* CARD HEADER */}
                  <div className="card-header bg-light border-0 py-3">
                    <div className="row align-items-center g-3">
                      <div className="col-md-6">
                        <h6 className="mb-0 text-muted">
                          <small>ORDER ID:</small>
                        </h6>
                        <h5 className="mb-0 fw-bold text-dark">{order._id}</h5>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <span className={`badge ${
                          order.orderStatus === "DELIVERED" ? "bg-success" :
                          order.orderStatus === "CANCELLED" ? "bg-danger" :
                          order.orderStatus === "SHIPPED" || order.orderStatus === "OUT_FOR_DELIVERY" ? "bg-info" :
                          "bg-warning"
                        } fs-6`}>
                          {order.orderStatus || "PLACED"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="card-body">
                    {/* CUSTOMER SECTION */}
                    <div className="row mb-4 pb-3 border-bottom">
                      <div className="col-md-6">
                        <h6 className="text-muted fw-bold mb-3">👤 CUSTOMER DETAILS</h6>
                        <div className="lh-lg">
                          <div><strong>Name:</strong> <span className="text-dark">{order.customer?.name}</span></div>
                          <div><strong>Phone:</strong> <span className="text-dark">{order.customer?.phone}</span></div>
                          <div><strong>Address:</strong> <span className="text-dark">{order.customer?.address}</span></div>
                          <div><strong>Pincode:</strong> <span className="text-dark">{order.customer?.pincode}</span></div>
                        </div>
                      </div>

                      {/* ORDER DATES */}
                      <div className="col-md-6">
                        <h6 className="text-muted fw-bold mb-3">📅 ORDER INFO</h6>
                        <div className="lh-lg">
                          <div><strong>Date:</strong> <span className="text-dark">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                          <div><strong>Method:</strong> <span className="badge bg-secondary">{order.paymentMethod || "COD"}</span></div>
                          <div><strong>Payment:</strong> <span className={`badge ${order.paymentStatus === "PAID" ? "bg-success" : order.paymentStatus === "FAILED" ? "bg-danger" : "bg-warning"}`}>
                            {order.paymentStatus || "PENDING"}
                          </span></div>
                        </div>
                      </div>
                    </div>

                    {/* ITEMS SECTION */}
                    <div className="mb-4">
                      <h6 className="text-muted fw-bold mb-3">🛍️ ORDER ITEMS</h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-center" style={{ width: "80px" }}>Image</th>
                              <th className="text-start">Product</th>
                              <th className="text-center">Qty</th>
                              <th className="text-end">Price</th>
                              <th className="text-end">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index} className="align-middle">
                                <td className="text-center">
                                  <img
                                    src={item.image || (item.productId && item.productId.image) || "https://via.placeholder.com/60?text=No+Image"}
                                    alt={item.name}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "6px",
                                      border: "1px solid #e5e7eb"
                                    }}
                                  />
                                </td>
                                <td className="text-start fw-500">{item.name}</td>
                                <td className="text-center"><span className="badge bg-light text-dark">{item.qty}</span></td>
                                <td className="text-end">₹{Number(item.price).toFixed(2)}</td>
                                <td className="text-end fw-bold">₹{(item.price * item.qty).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="row mt-3 pt-3 border-top">
                        <div className="col-md-8 text-end">
                          <h6 className="text-muted">TOTAL AMOUNT:</h6>
                        </div>
                        <div className="col-md-4 text-end">
                          <h5 className="fw-bold text-success">₹{Number(order.totalAmount).toFixed(2)}</h5>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT ACTIONS */}
                    <div className="mb-4 p-3 bg-light rounded">
                      <h6 className="text-muted fw-bold mb-3">💳 PAYMENT ACTIONS</h6>
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          onClick={() => updatePaymentStatus(order._id, "PAID")}
                          className="btn btn-sm btn-success"
                          disabled={order.paymentStatus === "PAID"}
                        >
                          ✓ Mark Paid
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(order._id, "FAILED")}
                          className="btn btn-sm btn-danger"
                          disabled={order.paymentStatus === "FAILED"}
                        >
                          ✗ Mark Failed
                        </button>
                        <button
                          onClick={() => downloadInvoice(order._id)}
                          className="btn btn-sm btn-info"
                        >
                          📄 Invoice
                        </button>
                      </div>
                    </div>

                    {/* ORDER STATUS ACTIONS */}
                    <div className="p-3 bg-light rounded">
                      <h6 className="text-muted fw-bold mb-3">
                        🚚 ORDER STATUS <span className="badge bg-primary">{order.orderStatus || "PLACED"}</span>
                      </h6>
                      <div className="d-flex gap-2 flex-wrap">
                        {["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].map(
                          (status) => {
                            const isAllowed = canUpdateStatus(order.orderStatus || "PLACED", status);
                            return (
                              <button
                                key={status}
                                disabled={!isAllowed}
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    status,
                                    order.orderStatus || "PLACED"
                                  )
                                }
                                className={`btn btn-sm ${isAllowed ? "btn-outline-primary" : "btn-outline-secondary disabled"}`}
                                title={isAllowed ? `Move to ${status}` : `Cannot transition from ${order.orderStatus} to ${status}`}
                              >
                                {status.replaceAll("_", " ")}
                              </button>
                            );
                          }
                        )}

                        <button
                          disabled={!["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY"].includes(order.orderStatus || "PLACED")}
                          onClick={() =>
                            updateOrderStatus(order._id, "CANCELLED", order.orderStatus || "PLACED")
                          }
                          className={`btn btn-sm ${!["DELIVERED", "CANCELLED", "RETURNED"].includes(order.orderStatus || "PLACED") ? "btn-outline-danger" : "btn-outline-secondary disabled"}`}
                          title={!["DELIVERED", "CANCELLED", "RETURNED"].includes(order.orderStatus || "PLACED") ? "Cancel this order" : "Cannot cancel delivered/cancelled orders"}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="card-footer bg-light border-top py-3 text-end">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️ Delete Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
