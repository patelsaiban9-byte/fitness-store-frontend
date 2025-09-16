import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderForm() {
  const { id } = useParams(); // productId from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    landmark: "",
    pincode: "",
  });

  const userRole = localStorage.getItem("role"); // ✅ get role

  // ✅ Use backend URL (works on phone + laptop)
  const API_URL =
    process.env.REACT_APP_API_URL || "https://fitness-store-backend.onrender.com";

  // Fetch selected product details
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

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Place order
  const handleOrder = async (e) => {
    e.preventDefault();

    // ✅ prevent admins from placing orders
    if (userRole === "admin") {
      alert("❌ Admins cannot place orders");
      return;
    }

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
        navigate("/products"); // go back to products page
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
    <div style={{ padding: "20px" }}>
      {product ? (
        <>
          <h2>Order Product: {product.name}</h2>
          <form onSubmit={handleOrder} style={{ marginTop: "20px" }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="number"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button type="submit" style={{ marginRight: "10px" }}>
              Confirm Order
            </button>
            <button type="button" onClick={() => navigate("/products")}>
              Cancel
            </button>
          </form>
        </>
      ) : (
        <p>Loading product...</p>
      )}
    </div>
  );
}

export default OrderForm;
