import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    landmark: "",
    pincode: "",
  });

  const userRole = localStorage.getItem("role");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, address, phone, pincode, landmark } = formData;

    if (name.trim().length < 3) {
      alert("Name must be at least 3 characters");
      return false;
    }

    if (address.trim().length < 5) {
      alert("Address must be at least 5 characters");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must be 10 digits");
      return false;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Pincode must be exactly 6 digits");
      return false;
    }

    if (landmark.trim() !== "" && landmark.trim().length < 3) {
      alert("Landmark must be at least 3 characters if entered");
      return false;
    }

    return true;
  };

  const handleOrder = async (e) => {
    e.preventDefault();

    if (userRole === "admin") {
      alert("❌ Admins cannot place orders");
      return;
    }

    if (!validateForm()) return;

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productId: id,
        }),
      });

      if (res.ok) {
        alert("✅ Order placed successfully!");
        navigate("/products");
      } else {
        const data = await res.json();
        alert(data.message || "❌ Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {product ? (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              Order Product: {product.name}
            </h2>

            <form onSubmit={handleOrder}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="address"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={formData.landmark}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="number"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <button type="submit" style={submitBtn}>
                Confirm Order
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                style={cancelBtn}
              >
                Cancel
              </button>
            </form>
          </>
        ) : (
          <p>Loading product...</p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #bbb",
  fontSize: "15px",
};

const submitBtn = {
  width: "100%",
  padding: "12px",
  background: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  marginBottom: "10px",
  transition: "0.3s",
};

const cancelBtn = {
  width: "100%",
  padding: "12px",
  background: "#d9534f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
};

export default OrderForm;
