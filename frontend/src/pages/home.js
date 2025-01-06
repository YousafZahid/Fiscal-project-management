import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome to Our Website</h1>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default Home;
