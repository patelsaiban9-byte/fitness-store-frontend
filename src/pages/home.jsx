import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      {/* Hero Section */}
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container py-5">
          <h1 className="display-4 fw-bold">Welcome to Our Health & Fitness Store</h1>
          <p className="lead text-muted mt-3">
            Discover premium health and fitness products that fit your lifestyle.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn btn-success btn-lg mt-3 px-4"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">💪 Quality Products</h5>
              <p className="card-text text-muted">
                Handpicked fitness supplements and equipment for your health journey.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">🚚 Fast Delivery</h5>
              <p className="card-text text-muted">
                Get your favorite products delivered to your doorstep quickly.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">⭐ Trusted by Customers</h5>
              <p className="card-text text-muted">
                Thousands of happy customers trust our store for their fitness needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
