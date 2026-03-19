import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";

const heroAds = [
  {
    id: 1,
    badge: "Limited Time",
    title: "Whey Protein Mega Deal",
    subtitle: "Extra 20% off on selected 2kg packs",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    badge: "Top Seller",
    title: "Home Gym Starter Combo",
    subtitle: "Dumbbells + bands + yoga mat from Rs 1,999",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    badge: "New Arrival",
    title: "Performance Running Shoes",
    subtitle: "Lightweight, breathable and built for speed",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
  },
];

const sideAds = [
  {
    id: 1,
    title: "Smart Fitness Watch",
    offer: "Up to 35% off",
    image:
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "Mass Gainer Specials",
    offer: "Buy 1 Get 1 on select brands",
    image:
      "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=700&q=80",
  },
];

const peopleAlsoViewed = [
  {
    id: 1,
    title: "Resistance Bands",
    image:
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Healthy Trail Mix",
    image:
      "https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Lifting Straps",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Sports Bra Pack",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Protein Cookies",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
  },
];

const inlinePromoAds = [
  {
    id: 1,
    title: "Weekend Flash Sale",
    subtitle: "Get up to 40% off on gym essentials",
    cta: "Explore Offers",
    image:
      "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Strength Setup Deals",
    subtitle: "Benches, bars and weights with combo pricing",
    cta: "View Combo",
    image:
      "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1200&q=80",
  },
];

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
  const [activeAd, setActiveAd] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAd((prev) => (prev + 1) % heroAds.length);
    }, 4500);

    return () => clearInterval(timer);
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

  const productBatchSize = 8;
  const productBatches = [];
  for (let i = 0; i < products.length; i += productBatchSize) {
    productBatches.push(products.slice(i, i + productBatchSize));
  }

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

        <section className="ads-wrapper mb-5">
          <div className="row g-3 align-items-stretch">
            <div className="col-12 col-lg-9">
              <div className="hero-ad-card">
                <div
                  className="hero-ad-track"
                  style={{
                    transform: `translateX(-${activeAd * 100}%)`,
                  }}
                >
                  {heroAds.map((ad) => (
                    <article key={ad.id} className="hero-ad-slide">
                      <img src={ad.image} alt={ad.title} className="hero-ad-image" />
                      <div className="hero-ad-overlay" />
                      <div className="hero-ad-content">
                        <span className="hero-ad-badge">{ad.badge}</span>
                        <h2>{ad.title}</h2>
                        <p>{ad.subtitle}</p>
                        <button type="button" className="btn btn-light btn-sm fw-semibold">
                          Shop Deal
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hero-ad-dots">
                  {heroAds.map((ad, index) => (
                    <button
                      key={ad.id}
                      type="button"
                      className={index === activeAd ? "dot active" : "dot"}
                      onClick={() => setActiveAd(index)}
                      aria-label={`View ad ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-3">
              <div className="side-ads-column">
                {sideAds.map((ad) => (
                  <article key={ad.id} className="side-ad-card">
                    <img src={ad.image} alt={ad.title} className="side-ad-image" />
                    <div className="side-ad-overlay" />
                    <div className="side-ad-content">
                      <h3>{ad.title}</h3>
                      <p>{ad.offer}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

        </section>

        {productBatches.map((batch, batchIndex) => {
          const promo = inlinePromoAds[batchIndex % inlinePromoAds.length];

          return (
            <React.Fragment key={`batch-${batchIndex}`}>
              <div className="row g-4 product-grid-row mb-2">
                {batch.map(renderProductCard)}
              </div>

              {batchIndex < productBatches.length - 1 && (
                <section className="mid-ads-block my-4">
                  <article className="inline-wide-ad">
                    <img src={promo.image} alt={promo.title} className="inline-wide-ad-image" />
                    <div className="inline-wide-ad-overlay" />
                    <div className="inline-wide-ad-content">
                      <p className="inline-ad-label">Sponsored</p>
                      <h3>{promo.title}</h3>
                      <p>{promo.subtitle}</p>
                      <button type="button" className="btn btn-light btn-sm fw-semibold">
                        {promo.cta}
                      </button>
                    </div>
                  </article>

                  {batchIndex % 2 === 0 && (
                    <section className="people-also-viewed mt-3">
                      <div className="people-header">People also viewed</div>
                      <div className="people-grid">
                        {peopleAlsoViewed.map((item) => (
                          <article key={item.id} className="people-item">
                            <img src={item.image} alt={item.title} />
                            <h4>{item.title}</h4>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}
                </section>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

export default Product;
