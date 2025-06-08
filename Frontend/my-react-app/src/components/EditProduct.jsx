import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/getProducts`);
        const selected = res.data.find(p => p.id === parseInt(id));
        if (selected) setProduct(selected);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (image) formData.append("image", image);

    try {
      await axios.put(`http://localhost:3000/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/Profile');
    } catch (err) {
      console.error("Eroare la editare:", err);
    }
  };

  return (
    <div className="edit-container">
      <form className="edit-form" onSubmit={handleSubmit}>
        <h2>Edit product</h2>

        <label>Product name</label>
        <input
          type="text"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          placeholder="Title"
        />

        <label>Description</label>
        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Description"
        />

        <label>Price</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          placeholder="Price"
        />

        <label>Category</label>
        <input
          type="text"
          value={product.category}
          onChange={(e) =>
            setProduct({ ...product, category: e.target.value })
          }
          placeholder="Category"
        />

        <label>Stock</label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          placeholder="Stock"
        />

        <label>New image (optional)</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />

        <button className="submit-btn" type="submit">
          Save changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
