import React from "react";
import { useCart } from "./CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>The cart is empty</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <img src={item.imgPath} alt={item.title} style={{ width: "50px" }} />
                {item.title} - ${item.price}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear Cart</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
