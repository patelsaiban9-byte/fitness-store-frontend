import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderForm() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    landmark: "",
    pincode: "",
  });

  /* ===============================
     LOAD CART OR DIRECT BUY ITEM
     =============================== */
  useEffect(() => {
    // Check if this is a direct buy order
    const directBuyItem = sessionStorage.getItem("directBuyItem");
    
    if (directBuyItem) {
      // Direct buy - use only the single item
      const item = JSON.parse(directBuyItem);
      setCartItems([item]);
    } else {
      // Cart checkout - use all cart items
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        setMessage({ type: "warning", text: "Your cart is empty. Add products before placing an order." });
        return;
      }
      setCartItems(cart);
    }
  }, [navigate]);

  /* ===============================
     FORM HANDLING
     =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const { name, email, address, phone, pincode } = formData;
    const errors = {};

    if (name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters.";
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      errors.phone = "Phone must be 10 digits.";
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      errors.pincode = "Pincode must be 6 digits.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage({ type: "danger", text: "Please fix the highlighted fields." });
      return false;
    }

    return true;
  };

  /* ===============================
     TOTAL
     =============================== */
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ===============================
     PLACE ORDER (FINAL FIX ✅)
     =============================== */
  const handleOrder = async (e) => {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});
    if (!validateForm()) return;

    const payload = {
      // attach logged-in user's ObjectId if available
      userId: localStorage.getItem("userId"),
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        landmark: formData.landmark,
      },
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      totalAmount,

      // ✅ ENUM-SAFE & FINAL
      paymentMethod: paymentMethod === "COD" ? "COD" : "UPI",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/orders/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show specific error messages from backend
        if (data.error === "Insufficient stock" && data.details) {
          const errorMsg = `Stock unavailable: ${data.details.join(" ")}`;
          setMessage({ type: "danger", text: errorMsg });
        } else {
          setMessage({ type: "danger", text: data.error || "Failed to place order." });
        }
        return;
      }

      setMessage({ type: "success", text: "Order placed successfully." });
      
      // Check if this was a direct buy or cart order
      const directBuyItem = sessionStorage.getItem("directBuyItem");
      
      if (directBuyItem) {
        // Direct buy - only clear sessionStorage
        sessionStorage.removeItem("directBuyItem");
      } else {
        // Cart order - clear cart from localStorage
        localStorage.removeItem("cart");
        // Dispatch custom event to notify navbar (cart cleared)
        window.dispatchEvent(new Event("cartUpdated"));
      }

      setTimeout(() => {
        navigate("/feedback");
      }, 1200);
    } catch (err) {
      console.error("Order error:", err);
      setMessage({ type: "danger", text: "Something went wrong while placing the order." });
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={summaryStyle}>
          <h3>🛒 Cart Summary</h3>

          {cartItems.map((item) => (
            <div key={item._id} style={rowStyle}>
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr />

          <div style={totalStyle}>
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        <form onSubmit={handleOrder}>
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setMessage(null)}
              ></button>
            </div>
          )}

          <div className="mb-3">
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
              required
            />
            {fieldErrors.name && <div className="invalid-feedback d-block">{fieldErrors.name}</div>}
          </div>

          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              required
            />
            {fieldErrors.email && <div className="invalid-feedback d-block">{fieldErrors.email}</div>}
          </div>

          <div className="mb-3">
            <input
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
              className={`form-control ${fieldErrors.address ? "is-invalid" : ""}`}
              required
            />
            {fieldErrors.address && <div className="invalid-feedback d-block">{fieldErrors.address}</div>}
          </div>

          <div className="mb-3">
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              className={`form-control ${fieldErrors.phone ? "is-invalid" : ""}`}
              required
            />
            {fieldErrors.phone && <div className="invalid-feedback d-block">{fieldErrors.phone}</div>}
          </div>

          <div className="mb-3">
            <input
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleChange}
              style={inputStyle}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <input
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              style={inputStyle}
              className={`form-control ${fieldErrors.pincode ? "is-invalid" : ""}`}
              required
            />
            {fieldErrors.pincode && <div className="invalid-feedback d-block">{fieldErrors.pincode}</div>}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <strong>Payment Method</strong>
            <div>
              <label>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Cash on Delivery
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Online Payment (Demo)
              </label>
            </div>
          </div>

          <button type="submit" style={submitBtn} disabled={submitting}>
            {submitting ? "Placing Order..." : "Confirm Order"}
          </button>
          <button type="button" onClick={() => navigate("/products")} style={cancelBtn}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
   =============================== */
const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle at top, #eef7ff, #e8f5e9)",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "500px",
  background: "#ffffff",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
};

const summaryStyle = {
  background: "#f9fafb",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "22px",
  border: "1px solid #e5e7eb",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "8px",
};

const totalStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: "bold",
  color: "#15803d",
};

const inputStyle = {
  width: "100%",
  marginBottom: "16px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
};

const submitBtn = {
  width: "100%",
  padding: "15px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  fontSize: "17px",
  fontWeight: "bold",
  marginBottom: "12px",
};

const cancelBtn = {
  width: "100%",
  padding: "14px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  fontSize: "16px",
};

export default OrderForm;
