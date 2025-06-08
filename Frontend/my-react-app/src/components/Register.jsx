import axios from "axios";
import React, {useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Register.css";

const Register = () =>{
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{ 
            await axios.post('http://localhost:3000/register', {
                userName,
                password,
                confirmPassword,
            },{
                headers: {'Content-Type':'application/json'}
            });
            navigate('/');
        }catch(err){
            const errorMessage = err.response?.data?.error;
            console.log(errorMessage);
        }
    }

    return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
        <p className="register-login">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
};
export default Register