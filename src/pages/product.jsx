import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Product Component
  -----------------
  - Fetch products from backend
  - Show product cards
  - Click card to open product detail page
*/

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ===============================
     FETCH PRODUCTS
     =============================== */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ===============================
     IMAGE URL HANDLING
     =============================== */
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_URL}/${img.replace(/^\/+/, "")}`;
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/300x200?text=Image+Not+Available";
  };

  /* ===============================
     LOADING
     =============================== */
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>No Products Available</h2>
      </div>
    );
  }

  /* ===============================
     UI
     =============================== */
  return (
    <>
      <style>
        {`
          .product-card {
            transition: all 0.3s ease;
            cursor: pointer;
            border: 1px solid #e9ecef !important;
          }
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
          }
        `}
      </style>

      <div className="container py-4">
        <h1 className="text-center mb-5 fw-bold">
          🛍️ Available Products
        </h1>

        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              {/* ✅ CARD CLICK → PRODUCT DETAIL */}
              <div
                className="card h-100 product-card shadow-sm"
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
              >
                {/* IMAGE */}
                <div
                  style={{
                    height: "220px",
                    backgroundColor: "#f8f9fa",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={handleImageError}
                  />
                </div>

                {/* INFO */}
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{product.name}</h5>

                  <p className="text-muted flex-grow-1">
                    {product.description || "No description available"}
                  </p>

                  <h6 className="fw-bold text-success">
                    ₹{product.price}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Product;
