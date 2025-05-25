import React, {useState} from "react";
import axios from "axios";

const AddProduct = () =>{
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const formData = new FormData();
            formData.append("title", productName);
            formData.append("description", productDescription);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("image", image);
            formData.append("stock", stock);
        
        try{
            await axios.post("http://localhost:3000/products",formData,
                {headers: { "Content-Type": "multipart/form-data" }}
            );
        } catch (err) {
            console.log(err);
        }
    }

    return(
        <div>
        <form onSubmit={handleSubmit}>
        <h2>Product name</h2>
        <input 
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
        />
        <h2>Product description</h2>
        <input
            type="text"
            placeholder="Product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
        />
        <h2>Price</h2>
        <input 
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />
        <h2>Category</h2>
        <input 
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
        />
        <h2>Image {image}</h2>
        <input 
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
        />
        <h2>Stock</h2>
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