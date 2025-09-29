import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const API_URL = import.meta.env.VITE_API_URL;

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

      <div className="product-grid">
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
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "320px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 2px 5px rgba(0,0,0,0.1)";
            }}
          >
            <div>
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
            </div>

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
                  width: "100%",
                }}
              >
                Buy
              </button>
            )}
          </div>
        ))}
      </div>

      <style>
        {`
          .product-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(1, 1fr); /* default = 1 per row */
          }

          @media (min-width: 576px) {
            .product-grid {
              grid-template-columns: repeat(2, 1fr); /* phones/tablets = 2 */
            }
          }

          @media (min-width: 992px) {
            .product-grid {
              grid-template-columns: repeat(4, 1fr); /* desktop = 4 */
            }
          }
        `}
      </style>
    </div>
  );
}

export default Product;
