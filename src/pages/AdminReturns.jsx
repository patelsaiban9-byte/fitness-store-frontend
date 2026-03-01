import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminReturns() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const userRole = localStorage.getItem("role");
  const adminId = localStorage.getItem("userId");

  useEffect(() => {
    // Check if user is admin
    if (userRole !== "admin") {
      navigate("/");
      return;
    }

    fetchReturns();
  }, [userRole, navigate]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/returns/admin/all`);
      const data = await res.json();
      setReturns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch returns error:", err);
      setReturns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (returnId) => {
    if (!window.confirm("Are you sure you want to approve this return request?")) {
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/api/returns/${returnId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes: adminNotes,
          adminId: adminId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Return request approved successfully!");
        setShowModal(false);
        setSelectedReturn(null);
        setAdminNotes("");
        fetchReturns();
      } else {
        alert(data.error || "Failed to approve return");
      }
    } catch (err) {
      console.error("❌ Approve return error:", err);
      alert("Failed to approve return");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (returnId) => {
    if (!window.confirm("Are you sure you want to reject this return request?")) {
      return;
    }

    try {
      setProcessing(true);
      const res = await fetch(`${API_URL}/api/returns/${returnId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes: adminNotes,
          adminId: adminId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Return request rejected successfully!");
        setShowModal(false);
        setSelectedReturn(null);
        setAdminNotes("");
        fetchReturns();
      } else {
        alert(data.error || "Failed to reject return");
      }
    } catch (err) {
      console.error("❌ Reject return error:", err);
      alert("Failed to reject return");
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (returnRequest) => {
    setSelectedReturn(returnRequest);
    setAdminNotes(returnRequest.adminNotes || "");
    setShowModal(true);
  };

  const closeModal = () => {
    if (!processing) {
      setShowModal(false);
      setSelectedReturn(null);
      setAdminNotes("");
    }
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      PENDING: "bg-warning text-dark",
      APPROVED: "bg-success",
      REJECTED: "bg-danger",
      COMPLETED: "bg-info",
    };
    return badgeClasses[status] || "bg-secondary";
  };

  const filteredReturns = filterStatus === "ALL" 
    ? returns 
    : returns.filter(r => r.status === filterStatus);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading return requests...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <h2 className="fw-bold text-primary">🔄 Return Management</h2>
          <p className="text-muted">Manage product return requests</p>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end gap-2">
            <button
              className={`btn ${filterStatus === "ALL" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("ALL")}
            >
              All ({returns.length})
            </button>
            <button
              className={`btn ${filterStatus === "PENDING" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setFilterStatus("PENDING")}
            >
              Pending ({returns.filter(r => r.status === "PENDING").length})
            </button>
            <button
              className={`btn ${filterStatus === "APPROVED" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setFilterStatus("APPROVED")}
            >
              Approved ({returns.filter(r => r.status === "APPROVED").length})
            </button>
            <button
              className={`btn ${filterStatus === "REJECTED" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setFilterStatus("REJECTED")}
            >
              Rejected ({returns.filter(r => r.status === "REJECTED").length})
            </button>
          </div>
        </div>
      </div>

      {filteredReturns.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>No return requests found</h5>
          <p className="mb-0">
            {filterStatus === "ALL" 
              ? "There are no return requests yet." 
              : `There are no ${filterStatus.toLowerCase()} return requests.`}
          </p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Return ID</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Refund Amount</th>
                    <th>Status</th>
                    <th>Requested Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReturns.map((returnRequest) => (
                    <tr key={returnRequest._id}>
                      <td>
                        <small className="font-monospace">
                          {returnRequest._id.slice(-8).toUpperCase()}
                        </small>
                      </td>
                      <td>
                        <small className="font-monospace">
                          {returnRequest.orderId?._id.slice(-8).toUpperCase() || "N/A"}
                        </small>
                      </td>
                      <td>
                        <div>
                          <strong>{returnRequest.userId?.name || "N/A"}</strong>
                          <br />
                          <small className="text-muted">
                            {returnRequest.userId?.email || "N/A"}
                          </small>
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">
                          ₹{returnRequest.refundAmount.toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(returnRequest.status)}`}>
                          {returnRequest.status}
                        </span>
                      </td>
                      <td>
                        <small>
                          {new Date(returnRequest.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(returnRequest)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showModal && selectedReturn && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => !processing && closeModal()}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={processing}
                ></button>
              </div>
              <div className="modal-body">
                {/* Return Information */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2">Return Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Return ID:</strong>{" "}
                        <span className="font-monospace">
                          {selectedReturn._id.slice(-8).toUpperCase()}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong>Order ID:</strong>{" "}
                        <span className="font-monospace">
                          {selectedReturn.orderId?._id.slice(-8).toUpperCase() || "N/A"}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong>Status:</strong>{" "}
                        <span className={`badge ${getStatusBadge(selectedReturn.status)}`}>
                          {selectedReturn.status}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Refund Amount:</strong>{" "}
                        <span className="text-success fw-bold">
                          ₹{selectedReturn.refundAmount.toFixed(2)}
                        </span>
                      </p>
                      <p className="mb-2">
                        <strong>Requested Date:</strong>{" "}
                        {new Date(selectedReturn.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {selectedReturn.reviewedAt && (
                        <p className="mb-2">
                          <strong>Reviewed Date:</strong>{" "}
                          {new Date(selectedReturn.reviewedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2">Customer Information</h6>
                  <p className="mb-2">
                    <strong>Name:</strong> {selectedReturn.userId?.name || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedReturn.userId?.email || "N/A"}
                  </p>
                </div>

                {/* Return Items */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2">Return Items</h6>
                  {selectedReturn.items.map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <strong>{item.name}</strong>
                        <br />
                        <small className="text-muted">Quantity: {item.qty}</small>
                      </div>
                      <div className="text-end">
                        <strong className="text-success">₹{(item.price * item.qty).toFixed(2)}</strong>
                        <br />
                        <small className="text-muted">₹{item.price}/item</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return Reason */}
                <div className="mb-4">
                  <h6 className="fw-bold border-bottom pb-2">Reason for Return</h6>
                  <p className="text-muted">{selectedReturn.reason}</p>
                </div>

                {/* Admin Notes */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Admin Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for this return request..."
                    disabled={processing || selectedReturn.status !== "PENDING"}
                    maxLength={500}
                  ></textarea>
                  <small className="text-muted">{adminNotes.length}/500 characters</small>
                </div>

                {selectedReturn.reviewedBy && (
                  <div className="alert alert-info">
                    <strong>Reviewed by:</strong> {selectedReturn.reviewedBy.name || "Admin"}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={processing}
                >
                  Close
                </button>
                {selectedReturn.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleReject(selectedReturn._id)}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "❌ Reject"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedReturn._id)}
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "✅ Approve"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReturns;
