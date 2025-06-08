import React, { useState } from "react";
import { useCart } from "./CartContext";
import axios from "axios";
import "../styles/CheckoutModal.css";

const CheckoutModal = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { clearCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim()) return alert("Introduceți o adresă!");
    if (paymentMethod === "Card" && !cardNumber.trim())
      return alert("Introduceți numărul cardului!");

    const token = localStorage.getItem("token");

    try {
      await axios.post("http://localhost:3000/cart/checkout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

        clearCart();
        setSubmitted(true);
        setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Eroare la checkout:", err);
      alert("A apărut o eroare la finalizarea comenzii.");
    }
  };

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <button className="close-btn only-close" onClick={onClose}>×</button>

        {!submitted ? (
          <>
            <h2>Complete the order</h2>
            <form onSubmit={handleSubmit}>
              <label>Payment method:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Card">Card</option>
                <option value="Ramburs">Ramburs</option>
              </select>

              {paymentMethod === "Card" && (
                <>
                  <label>Card number:</label>
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </>
              )}

              <label>Delivery address:</label>
              <input
                type="text"
                placeholder="Stradă, număr, oraș"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <button type="submit">Pay</button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <h3>✅ The transaction was completed successfully.!</h3>
            <p>Method: {paymentMethod}</p>
            <p>Address: {address}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
