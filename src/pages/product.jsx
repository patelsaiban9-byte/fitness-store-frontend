import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // ✅ get role

  // ✅ Use backend URL (works on phone + laptop)
  const API_URL =
    process.env.REACT_APP_API_URL || "https://fitness-store-backend.onrender.com";

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Products</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "220px",
              textAlign: "center",
            }}
          >
            {/* ✅ Show product image from backend */}
            {product.image && (
              <img
                src={`${API_URL}${product.image}`}
                alt={product.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
            )}

            <h3>{product.name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {product.description}
            </p>
            <p style={{ fontWeight: "bold", color: "green" }}>
              ₹{product.price}
            </p>

            {/* Show Buy button only for normal users */}
            {userRole !== "admin" && (
              <button
                onClick={() => navigate(`/order/${product._id}`)}
                style={{
                  background: "blue",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Buy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
