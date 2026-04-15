import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-5">
      <div className="container py-4">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-md-6">
            <h5 className="footer-brand mb-2">Fitness Store</h5>
            <p className="footer-text mb-0">
              Premium fitness gear and supplements to support every step of your training journey.
            </p>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="list-unstyled mb-0 footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-heading">Customer</h6>
            <ul className="list-unstyled mb-0 footer-links">
              <li><Link to="/my-orders">My Orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3">
        <div className="container d-flex flex-column flex-sm-row justify-content-between gap-2">
          <small>© {year} Fitness Store. All rights reserved.</small>
          <small>Built for your active lifestyle.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
