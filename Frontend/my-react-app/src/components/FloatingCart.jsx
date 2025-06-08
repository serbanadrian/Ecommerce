import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import CheckoutModal from "./CheckoutModal";
import "../styles/FloatingCart.css";

const FloatingCart = () => {
  const { cart, removeFromCart, toggleCart, isOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className={`floating-cart ${!isOpen ? "closed" : ""}`}>
      <div className="cart-controls">
        {isOpen ? (
          <>
            <button className="close-btn" onClick={toggleCart}>✖</button>
          </>
        ) : (
          <button className="open-btn" onClick={toggleCart}>🛒</button>
        )}
      </div>

      {isOpen && (
        <>
          <div>
            <h4>Products in cart:</h4>
            {cart.length === 0 ? (
              <p>The cart is empty</p>
            ) : (
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.title} x {item.quantity}
                    <button onClick={() => removeFromCart(item.id)}>🗑</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Afișează butonul Buy doar când coșul e deschis */}
          <button onClick={() => setShowCheckout(true)}>Buy</button>
        </>
      )}

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
};

export default FloatingCart;
