import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending signup request to Django backend
      await axiosInstance.post("signup/", { username, email, password });
      setMessage("Signup successful! Please check your email for verification.");
      // Redirecting after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      if (error.response) {
          console.error("Error response:", error.response.data);
          setMessage(error.response.data.detail || "Error during signup.");
      } else {
          console.error("Error:", error.message);
          setMessage("Error during signup. Please try again.");
      }
  }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
