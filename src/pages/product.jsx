import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products
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

  // Fix image URL for proper display
  const getImageUrl = (img) => {
    if (!img) return "";
    
    // ✅ If already a full URL (Cloudinary or external), return as-is
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    
    // ✅ If relative path, prepend API_URL (for old local images)
    return `${API_URL}/${img.replace(/^\/+/, "")}`;
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available";
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-3">No Products Available</h2>
          <p className="text-muted">Check back later for new products!</p>
        </div>
      </div>
    );
  }

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
          
          .product-card .card-img-top {
            transition: transform 0.3s ease;
          }
          
          @media (max-width: 575.98px) {
            .product-card {
              font-size: 0.9rem;
            }
          }
        `}
      </style>
      
      <div className="container py-4 py-md-5">
        <h1 className="text-center mb-4 mb-md-5 fw-bold">🛍️ Available Products</h1>
        
        <div className="row g-4 g-md-5">
          {products.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
              <div className="card h-100 shadow-sm border-0 product-card">
              {product.image ? (
                <div className="position-relative" style={{ overflow: "hidden", height: "220px", backgroundColor: "#f8f9fa" }}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onError={handleImageError}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                </div>
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "220px" }}>
                  <span className="text-muted">No Image</span>
                </div>
              )}
              
              <div className="card-body d-flex flex-column p-3 p-md-4">
                <h5 className="card-title fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
                  {product.name}
                </h5>
                
                <p 
                  className="card-text text-muted flex-grow-1 mb-3" 
                  style={{ 
                    fontSize: "0.9rem", 
                    lineHeight: "1.5",
                    maxHeight: "none"
                  }}
                >
                  {product.description || "No description available"}
                </p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-success fs-5">₹{product.price?.toLocaleString() || product.price}</span>
                </div>

                {userRole !== "admin" && (
                  <button
                    onClick={() => navigate(`/order/${product._id}`)}
                    className="btn btn-primary w-100 fw-semibold"
                    style={{ fontSize: "0.9rem" }}
                  >
                    🛒 Buy Now
                  </button>
                )}
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
