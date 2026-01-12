import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  Cart Page
  ---------
  - Read cart data from localStorage
  - Increase / decrease quantity
  - Remove product
  - Show total price
  - Redirect to OrderForm on checkout
*/

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on page load
  useEffect(() => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Update localStorage + state together
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  // Increase quantity
  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, qty: item.qty + 1 }
        : item
    );
    updateCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0);

    updateCart(updatedCart);
  };

  // Remove item completely
  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );
    updateCart(updatedCart);
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.qty,
    0
  );

  // ✅ NEW: Checkout → OrderForm (cart mode)
  const handleCheckout = () => {
    navigate("/order/cart");
  };

  // If cart empty
  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your Cart is Empty 🛒</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/products")}
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">🛒 My Cart</h2>

      {cart.map((item) => (
        <div
          key={item._id}
          className="card mb-3 shadow-sm"
        >
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <img
                src={item.image || (item.images && item.images[0]) || item.imageUrl}
                alt={item.name}
                style={{ width: 80, height: 80, objectFit: "cover" }}
                className="rounded"
              />

              <div className="ms-3">
                <h5 className="mb-0 d-flex align-items-center gap-3">
                  <span className="fw-bold">{item.name}</span>

                  {/* Price then Quantity, centered together */}
                  <div className="ms-3 d-flex align-items-center justify-content-center gap-3 text-center">
                    <span className="text-muted">Price: ₹{item.price}</span>
                    <small className="text-muted">Qty: {item.qty}</small>
                  </div>
                </h5>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3 mt-md-0">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => decreaseQty(item._id)}
              >
                −
              </button>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => increaseQty(item._id)}
              >
                +
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => removeItem(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <hr />

      <h4 className="fw-bold">
        Total: ₹{totalPrice}
      </h4>

      {/* ✅ UPDATED BUTTON */}
      <button
        className="btn btn-success mt-3"
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;
