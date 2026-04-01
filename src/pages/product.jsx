import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";

const Toast = ({ message, type, show, onClose }) => {
  if (!show) return null;

  const alertClass = {
    success: "alert-success",
    danger: "alert-danger",
    warning: "alert-warning",
  }[type] || "alert-info";

  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade show fixed-top mx-auto mt-3`}
      role="alert"
      style={{ width: "90%", maxWidth: "520px", zIndex: 1050 }}
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const toastTimerRef = useRef(null);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const userRole = localStorage.getItem("role");

  const showToast = (message, type = "info") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ show: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  };

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
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!normalizedQuery) return true;

    const name = (product.name || "").toLowerCase();
    const description = (product.description || "").toLowerCase();
    const price = String(product.price ?? "").toLowerCase();

    return (
      name.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      price.includes(normalizedQuery)
    );
  });

  const renderProductCard = (product) => (
    <div
      key={product._id}
      className="col-12 col-sm-6 col-md-4 col-lg-3"
    >
      <div
        className="card h-100 product-card shadow-sm"
        onClick={() =>
          navigate(`/product/${product._id}`)
        }
      >
        <div className="product-image-wrap">
          <span className="product-chip">Top Pick</span>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-100 h-100 product-image"
            onError={handleImageError}
          />
        </div>

        <div className="card-body d-flex flex-column product-body">
          <h5 className="fw-bold product-title">{product.name}</h5>

          <p className="text-muted flex-grow-1 product-desc">
            {product.description || "No description available"}
          </p>

          <div className="price-row">
            <h6 className="fw-bold text-success mb-0">
              ₹{product.price}
            </h6>
            <span className="delivery-pill">Fast Delivery</span>
          </div>

          {product.stock != null && (
            <div className="mt-2 mb-2">
              {product.stock === 0 ? (
                <span className="badge bg-danger">Out of Stock</span>
              ) : product.stock <= (product.minimumStockThreshold || 5) ? (
                <span className="badge bg-warning text-dark">
                  Low Stock: {product.stock} left
                </span>
              ) : (
                <span className="badge bg-success">In Stock</span>
              )}
            </div>
          )}

          {userRole !== "admin" && (
            <button
              className="btn btn-success mt-2 w-100 product-btn"
              disabled={product.stock != null && product.stock === 0}
              onClick={(e) => {
                e.stopPropagation();

                if (product.stock != null && product.stock === 0) {
                  showToast("Sorry, this product is out of stock!", "warning");
                  return;
                }

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItem = cart.find(
                  (item) => item._id === product._id
                );

                if (product.stock != null && product.stock > 0) {
                  const currentQtyInCart = existingItem ? existingItem.qty : 0;
                  if (currentQtyInCart >= product.stock) {
                    showToast(
                      `Sorry, only ${product.stock} units available. You already have ${currentQtyInCart} in your cart.`,
                      "warning"
                    );
                    return;
                  }
                }

                if (existingItem) {
                  existingItem.qty += 1;
                } else {
                  cart.push({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty: 1,
                  });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                window.dispatchEvent(new Event("cartUpdated"));
                showToast(`${product.name} added to cart!`, "success");
              }}
              style={{
                opacity: (product.stock != null && product.stock === 0) ? 0.5 : 1,
                cursor: (product.stock != null && product.stock === 0) ? "not-allowed" : "pointer",
              }}
            >
              {(product.stock != null && product.stock === 0) ? "Out of Stock" : "🛒 Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

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
      <div className="container py-4">
        <Toast
          message={toast.message}
          type={toast.type}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />

        <h1 className="text-center mb-5 fw-bold">
          🛍️ Available Products
        </h1>

        <div className="product-search-wrap mb-4">
          <div className="input-group product-search-group">
            <span className="input-group-text product-search-icon">🔎</span>
            <input
              type="text"
              className="form-control product-search-input"
              placeholder="Search products by name, description, or price"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                type="button"
                className="btn product-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                title="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <p className="product-search-meta mb-0 mt-2">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-4">
            <h5 className="mb-1">No matching products found</h5>
            <p className="text-muted mb-0">Try a different keyword.</p>
          </div>
        ) : (
          <div className="row g-4 product-grid-row mb-2">
            {filteredProducts.map(renderProductCard)}
          </div>
        )}
      </div>
    </>
  );
}

export default Product;
