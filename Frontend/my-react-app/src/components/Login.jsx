import axios from 'axios';
import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Login.css";

const Login = () =>{
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:3000/login',{
                userName,
                password,
            },{
                headers: {'Content-Type':'application/json'},
            }
        );
        localStorage.setItem('token',response.data.token);
        navigate('/Dashboard')
        }catch(err){
            const errorMessage = err.response?.data?.error;
            console.log(errorMessage);
        }
    }

    return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="UserName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">Login</button>
        <p className="login-register">
          Don't have an account? <Link to="/Register">Register</Link>
        </p>
      </form>
    </div>
  );
};
export default Login