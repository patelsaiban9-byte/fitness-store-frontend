import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderForm() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    landmark: "",
    pincode: "",
  });

  /* ===============================
     LOAD CART
     =============================== */
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Cart is empty");
      navigate("/products");
      return;
    }
    setCartItems(cart);
  }, [navigate]);

  /* ===============================
     FORM HANDLING
     =============================== */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, address, phone, pincode } = formData;

    if (name.trim().length < 3) return alert("Name must be at least 3 characters");
    if (address.trim().length < 5) return alert("Address must be at least 5 characters");
    if (!/^[0-9]{10}$/.test(phone)) return alert("Phone must be 10 digits");
    if (!/^[0-9]{6}$/.test(pincode)) return alert("Pincode must be 6 digits");

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
     PLACE ORDER (FINAL FIX)
     =============================== */
  const handleOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        landmark: formData.landmark,
      },
      items: cartItems.map((item) => ({
        productId: item._id,   // ✅ FIXED
        name: item.name,
        price: item.price,
        qty: item.qty,         // ✅ FIXED
      })),
      totalAmount,
    };

    try {
      const res = await fetch(`${API_URL}/api/orders/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to place order");
        return;
      }

      alert("✅ Order placed successfully");
      localStorage.removeItem("cart");
      navigate("/products");
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong");
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top, #eef7ff, #e8f5e9)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
          color: "#111827",
        }}
      >
        {/* CART SUMMARY */}
        <div
          style={{
            background: "#f9fafb",
            padding: "18px",
            borderRadius: "14px",
            marginBottom: "22px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>🛒 Cart Summary</h3>

          {cartItems.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>{item.name} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <hr />

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#15803d" }}>
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleOrder}>
          <input name="name" placeholder="Your Name" onChange={handleChange} style={inputStyle} />
          <input name="address" placeholder="Your Address" onChange={handleChange} style={inputStyle} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />
          <input name="landmark" placeholder="Landmark" onChange={handleChange} style={inputStyle} />
          <input name="pincode" placeholder="Pincode" onChange={handleChange} style={inputStyle} />

          <button type="submit" style={submitBtn}>Confirm Order</button>
          <button type="button" onClick={() => navigate("/products")} style={cancelBtn}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
   =============================== */
const inputStyle = {
  width: "100%",
  marginBottom: "16px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  background: "#f8fafc",
  color: "#111827",
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
