import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("login/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    
    <div>
      <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/g8lwEmx91kkM2yc9/scene.splinecode"></spline-viewer>
      <h2>Login</h2>
      
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
