import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "./Product";
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/getProducts");
        setProducts(res.data);
      } catch (err) {
        console.error("Eroare la preluarea produselor:", err);
      }
    };

    fetchProducts();
  }, []);

  const profile = () => {
    navigate('/Profile');
  };

  const handleReset = () => {
    setCategoryInput("");
    setCategoryFilter("");
    setSortOption("default");
  };

  const filteredProducts = products.filter(product =>
    product.category?.toLowerCase().includes(categoryFilter.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "category":
        return a.category?.localeCompare(b.category || "");
      default:
        return 0;
    }
  });

  return (
     <div>
         <div className="dashboard-header">
            <div className="dashboard-topbar">
                <h1>Welcome to QuickSell</h1>
                <button className="profile-btn" onClick={profile}>Profile</button>
            </div>

            <div className="filters">
                <div className="filter-group">
                <label>Sort:</label>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="default">Implicit</option>
                    <option value="priceAsc">Rising price</option>
                    <option value="priceDesc">Rising price</option>
                    <option value="category">Category (A-Z)</option>
                </select>
                </div>

                        <div className="filter-group">
                <label>Category:</label>
                <input
                    type="text"
                    placeholder="Product"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                />
                <button className="filter-btn" onClick={() => setCategoryFilter(categoryInput)}>
                    Filter
                </button>
                <button className="reset-btn" onClick={handleReset}>
                    Return to default
                </button>
                </div>
            </div>
        </div>


      <div className="products-container">
        {sortedProducts.map((item) => (
          <Product
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            stock={item.stock}
            price={item.price}
            imgPath={`http://localhost:3000${item.image}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
