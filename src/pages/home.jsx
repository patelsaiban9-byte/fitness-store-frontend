import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    // Added py-5 for top/bottom padding and min-vh-100 for full-screen feel
    <div className="container py-5 min-vh-100">
      
      {/* 🌟 Enhanced Hero Section (Jumbotron) */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          {/* Using Jumbotron styling (Bootstrap 5.2 equivalent) */}
          <div className="p-5 bg-dark text-white rounded-5 shadow-lg border border-success border-4">
            <div className="row align-items-center">
              <div className="col-md-7 text-start">
                {/* Larger, Bolder Title */}
                <h1 className="display-4 fw-bolder mb-3 text-warning">Fuel Your Success</h1>
                {/* Better call to action description */}
                <p className="lead text-light mb-4">
                  Unlock your full potential with our premium range of supplements, gear, and expert-approved essentials. Your fitness journey starts here.
                </p>
                <button
                  onClick={() => navigate("/products")}
                  className="btn btn-warning btn-lg mt-2 px-5 fw-bold text-dark text-uppercase"
                  style={{ fontSize: '1.1rem' }}
                >
                  Explore Products &rarr;
                </button>
              </div>
              <div className="col-md-5 d-none d-md-block text-center">
                 {/* Placeholder for an image or large icon */}
                 <div className="p-4 bg-success rounded-3 display-1 fw-bold">🏋️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- */}

      {/* 🔥 Why Choose Us Section - Distinct Heading Style */}
      <h2 className="text-center display-6 fw-bold mb-2 text-dark">Why Our Customers Choose Us</h2>
      <p className="text-center text-secondary mb-5 lead">
        Commitment to quality, speed, and exceptional support.
      </p>

      {/* Features Section - Responsive Grid with Gap */}
      <div className="row g-4 mb-5">
        
        {/* Feature Card 1: Quality Products */}
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 shadow border-0 bg-light text-center p-3">
            <div className="card-body">
              <span className="text-success display-6 mb-3 d-block">✅</span>
              <h5 className="card-title fw-bold fs-5 text-dark">Premium Quality Assured</h5>
              <p className="card-text text-secondary">
                We only source lab-tested and certified supplements and durable equipment.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Card 2: Fast Delivery */}
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 shadow border-0 bg-light text-center p-3">
            <div className="card-body">
              <span className="text-primary display-6 mb-3 d-block">🚀</span>
              <h5 className="card-title fw-bold fs-5 text-dark">Lightning Fast Delivery</h5>
              <p className="card-text text-secondary">
                Quick shipping across the nation so you don't miss a single workout.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Card 3: Customer Trust */}
        <div className="col-lg-4 col-md-12">
          <div className="card h-100 shadow border-0 bg-light text-center p-3">
            <div className="card-body">
              <span className="text-danger display-6 mb-3 d-block">🤝</span>
              <h5 className="card-title fw-bold fs-5 text-dark">Dedicated Support Team</h5>
              <p className="card-text text-secondary">
                Our experts are ready to assist you with advice on products and training.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* --- */}

      {/* 📣 Call-to-Action Banner */}
      <div className="row justify-content-center">
          <div className="col-lg-10">
              <div className="p-4 bg-warning rounded-3 shadow-sm d-flex justify-content-between align-items-center flex-column flex-md-row">
                  <h3 className="h4 fw-bold mb-3 mb-md-0 text-dark">Ready to take the next step?</h3>
                  <button
                      onClick={() => navigate("/products")}
                      className="btn btn-dark btn-lg fw-bold"
                  >
                      Get Started Now
                  </button>
              </div>
          </div>
      </div>

    </div>
  );
}

export default Home;