import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../styles/AddProduct.css";

const AddProduct = () =>{
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [stock, setStock] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
            formData.append("title", productName);
            formData.append("description", productDescription);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("image", image);
            formData.append("stock", stock);

        const token = localStorage.getItem("token");
        
        try{
            await axios.post("http://localhost:3000/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/Profile');
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <div className="add-product-container">
        <form className="product-form" onSubmit={handleSubmit}>
            <h2>Add a product</h2>
        <label>Name Product</label>
        <input 
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
        />
        <label>Description</label>
        <input
            type="text"
            placeholder="Product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
        />
        <label>Price</label>
        <input 
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />
        <label>Category</label>
        <input 
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
        />
        <label>Image</label>
        <input 
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
        />
        <label>Stock</label>
        <input 
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
        />
        <button type="submit">Add Product</button>
        </form>
        </div>
    );
}
export default AddProduct;