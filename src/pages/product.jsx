import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Product Component
  -----------------
  - Fetch products from backend
  - Show product cards
  - Add to Cart (localStorage based)
  - Buy Now (existing logic untouched)
*/

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Get user role from localStorage (already used in your project)
  const userRole = localStorage.getItem("role");

  // Backend API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ===============================
     FETCH PRODUCTS (OLD LOGIC)
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
     IMAGE URL HANDLING (OLD LOGIC)
     =============================== */
  const getImageUrl = (img) => {
    if (!img) return "";

    // If already full URL (Cloudinary)
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // If local image path
    return `${API_URL}/${img.replace(/^\/+/, "")}`;
  };

  // If image fails to load
  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/300x200?text=Image+Not+Available";
  };

  /* ===============================
     ADD TO CART (NEW FEATURE)
     =============================== */
  const addToCart = (product) => {
    // Get cart from localStorage (or empty array)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in cart
    const existingItem = cart.find(
      (item) => item._id === product._id
    );

    if (existingItem) {
      // If exists, increase quantity
      existingItem.qty += 1;
    } else {
      // If not exists, add new product
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      });
    }

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Simple confirmation
    alert("Product added to cart 🛒");
  };

  /* ===============================
     LOADING STATE
     =============================== */
  if (loading) {
    return (
      <div className="container py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
     NO PRODUCTS STATE
     =============================== */
  if (products.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>No Products Available</h2>
          <p className="text-muted">
            Check back later for new products!
          </p>
        </div>
      </div>
    );
  }

  /* ===============================
     MAIN UI
     =============================== */
  return (
    <>
      {/* Card hover styling */}
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

      <div className="container py-4 py-md-5">
        <h1 className="text-center mb-5 fw-bold">
          🛍️ Available Products
        </h1>

        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div className="card h-100 product-card shadow-sm">
                {/* Product Image */}
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

                {/* Product Info */}
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold">{product.name}</h5>

                  <p className="text-muted flex-grow-1">
                    {product.description || "No description available"}
                  </p>

                  <h6 className="fw-bold text-success mb-3">
                    ₹{product.price}
                  </h6>

                  {/* Buttons (Hide for Admin) */}
                  {userRole !== "admin" && (
                    <div className="d-flex gap-2">
                      {/* Add to Cart */}
                      <button
                        className="btn btn-outline-primary w-50"
                        onClick={() => addToCart(product)}
                      >
                        ➕ Add to Cart
                      </button>

                      {/* Buy Now (OLD LOGIC – untouched) */}
                      <button
                        className="btn btn-primary w-50"
                        onClick={() =>
                          navigate(`/order/${product._id}`)
                        }
                      >
                        🛒 Buy Now
                      </button>
                    </div>
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
