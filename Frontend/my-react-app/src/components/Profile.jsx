import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "./Product";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [products, setProducts] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(bio || "");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");


  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name);
      setBio(res.data.bio);
      setAvatar(res.data.avatar);
    } catch (err) {
      console.error("Eroare la profil:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/getUserProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Eroare la produse:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProducts();
  }, [token]);

  const handleAddAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) return alert("Selectează o imagine mai întâi!");

    const formData = new FormData();
    formData.append("avatar", avatarFile);
    setIsEditingAvatar(false);  

    try {
      await axios.post("http://localhost:3000/addAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProfile();
    } catch (err) {
      console.log("Eroare la trimiterea avatarului:", err);
    }
  };

  const handleSaveBio = async () => {
  try {
    await axios.put(
      "http://localhost:3000/updateBio",
      { bio: newBio },
      { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setBio(newBio);
    setIsEditingBio(false);
  } catch (err) {
    console.error("Eroare la salvarea bio:", err);
  }
};

const handleDeleteLocal = (deletedId) => {
  setProducts(prev => prev.filter(p => p.id !== deletedId));
};

  const addProduct = () => {
    navigate('/AddProduct');
  };

  return (
    <div className="profile-container">
      <div className="avatar-section">
        {avatar && !isEditingAvatar ? (
          <>
            <img
              src={`http://localhost:3000${avatar}`}
              alt="Avatar"
              className="avatar-image"
            />
            <button onClick={() => setIsEditingAvatar(true)}>Edit Avatar</button>
          </>
          ) : (
            <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          <button onClick={handleAddAvatar}>Save</button>
          <button onClick={() => setIsEditingAvatar(false)}>Cancel</button>
        </>
      )}
</div>

        <div className="Name">
      <h2>{name}</h2>
      </div>
      <div className="rightAlignment">
        <div className="profile-actions">
          <button onClick={addProduct}>Add Product</button>
          <button onClick={() => navigate("/Dashboard")}>Go to Shop</button>
        </div>
      </div>
      <h3>Bio</h3>
      {isEditingBio ? (
        <div>
           < textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              rows="4"
              cols="50"
          />
        <button onClick={handleSaveBio}>Save</button>
        <button onClick={() => setIsEditingBio(false)}>Cancel</button>
      </div>
      ) : (
      <>
        <p>{bio || "No bio yet."}</p>
        <button onClick={() => setIsEditingBio(true)}>
         {bio ? "Edit Bio" : "Add Bio"}
        </button>
     </>
)}

      <div className="products-container">
        {products.map((item) => (
          <Product
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            stock={item.stock}
            price={item.price}
            imgPath={`http://localhost:3000${item.image}`}
            userId={item.user_id}
            onDelete={handleDeleteLocal}
  />
        ))}
      </div>
    </div>
  );
};

export default Profile;
