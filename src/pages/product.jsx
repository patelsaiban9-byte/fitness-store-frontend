import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";

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
  const userRole = localStorage.getItem("role");

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
                  alert("Sorry, this product is out of stock!");
                  return;
                }

                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItem = cart.find(
                  (item) => item._id === product._id
                );

                if (product.stock != null && product.stock > 0) {
                  const currentQtyInCart = existingItem ? existingItem.qty : 0;
                  if (currentQtyInCart >= product.stock) {
                    alert(`Sorry, only ${product.stock} units available. You already have ${currentQtyInCart} in your cart.`);
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
                alert(`${product.name} added to cart!`);
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
        <h1 className="text-center mb-5 fw-bold">
          🛍️ Available Products
        </h1>
        <div className="row g-4 product-grid-row mb-2">
          {products.map(renderProductCard)}
        </div>
      </div>
    </>
  );
}

export default Product;
