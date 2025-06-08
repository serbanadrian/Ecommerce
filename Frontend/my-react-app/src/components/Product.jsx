import React from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/styles.css";
import "../styles/Product.css";

const Product = ({ id, title, description, stock, price, imgPath, userId, onDelete }) => {
  const { addToCart } = useCart();

  const token = localStorage.getItem("token");
  const loggedUserId = JSON.parse(atob(token.split('.')[1])).userId;

  const handleAddToCart = async () => {
  console.log("Add to Cart:", { id, title, price });

  const token = localStorage.getItem("token");
  try {
    await axios.post("http://localhost:3000/cart/add", {
      productId: id,
      quantity: 1,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    addToCart({ id, title, price, imgPath });
  } catch (err) {
    console.error("Eroare la adăugare în coș:", err);
  }
};

  const handleDelete = async () => {
    if (!window.confirm("Ești sigur că vrei să ștergi produsul?")) return;

    try {
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDelete) onDelete(id);
    } catch (err) {
      console.error("Eroare la ștergere:", err);
    }
  };

  return (
    <div className="product">
      <img src={imgPath} alt={title} />
      <h3>{title}</h3>
      <p className="product-info-box">{description}</p>
      <p className="product-info-box">Stock: {stock}</p>
      <p className="product-info-box">Price: ${price}</p>

      {userId === loggedUserId ? (
        <div className="product-actions">
          <Link to={`/edit/${id}`}>
            <button className="edit-button">Edit</button>
          </Link>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default Product;
