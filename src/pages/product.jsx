import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role"); // ✅ get role

  // ✅ Updated: use VITE_API_URL from .env for Vite
  const API_URL = import.meta.env.VITE_API_URL;

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
      <h1 className="text-center mb-4">Available Products</h1>

      {/* ✅ Responsive Grid: 2 cols on mobile, 4 cols on desktop */}
      <div
        className="grid gap-5 sm:grid-cols-2 md:grid-cols-4"
        style={{ alignItems: "stretch" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              textAlign: "center",
              background: "#fff",
            }}
          >
            {/* ✅ Show product image from backend */}
            {product.image && (
              <img
                src={`${API_URL}${product.image}`}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            )}

            <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
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
                  marginTop: "10px",
                  width: "100%", // ✅ full width button
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
