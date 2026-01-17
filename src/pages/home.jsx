import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-text">
              <h1 className="hero-title">Fuel Your Success</h1>
              <p className="hero-subtitle">Transform Your Body, Transform Your Life</p>
              <p className="hero-description">
                Unlock your full potential with our premium range of supplements, gear, and expert-approved essentials. Your fitness journey starts here.
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate("/products")}
                  className="btn btn-light btn-lg"
                >
                  Explore Products
                </button>
                <button 
                  onClick={() => navigate("/about")}
                  className="btn btn-outline-light btn-lg"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-6 hero-icon">
              <div className="icon-display">
                <span>🏋️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Commitment to quality, speed, and exceptional support</p>
          
          <div className="row g-4 mt-4">
            
            {/* Feature 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon quality-icon">
                  <span>✅</span>
                </div>
                <h3 className="feature-title">Premium Quality</h3>
                <p className="feature-text">
                  Lab-tested and certified supplements with durable, high-quality equipment
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon delivery-icon">
                  <span>🚀</span>
                </div>
                <h3 className="feature-title">Fast Delivery</h3>
                <p className="feature-text">
                  Quick shipping across the nation so you never miss a workout
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card">
                <div className="feature-icon support-icon">
                  <span>🤝</span>
                </div>
                <h3 className="feature-title">Expert Support</h3>
                <p className="feature-text">
                  Dedicated team ready to assist with product advice and training tips
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Preview */}
      <section className="trending-section">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">Check out what's popular with our community</p>
          
          <div className="row g-4 mt-4">
            {[
              { icon: '💊', title: 'Protein Supplements', desc: 'Premium whey & plant-based options' },
              { icon: '🏃', title: 'Fitness Gear', desc: 'Latest workout equipment & accessories' },
              { icon: '📖', title: 'Training Guides', desc: 'Expert-created workout programs' },
              { icon: '⚡', title: 'Energy Boosters', desc: 'Pre-workout and recovery products' }
            ].map((item, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="trending-card">
                  <div className="trending-icon">{item.icon}</div>
                  <h4 className="trending-title">{item.title}</h4>
                  <p className="trending-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row g-4">
            {[
              { stat: '10K+', label: 'Happy Customers' },
              { stat: '500+', label: 'Premium Products' },
              { stat: '50+', label: 'Expert Trainers' },
              { stat: '24/7', label: 'Customer Support' }
            ].map((item, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="stat-card">
                  <div className="stat-number">{item.stat}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform?</h2>
            <p className="cta-subtitle">Join thousands of fitness enthusiasts on their journey to success</p>
            <div className="cta-buttons">
              <button 
                onClick={() => navigate("/products")}
                className="btn btn-light btn-lg"
              >
                Start Shopping
              </button>
              <button 
                onClick={() => navigate("/register")}
                className="btn btn-outline-light btn-lg"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;