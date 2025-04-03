import React from "react";
import { useNavigate } from "react-router-dom";

const AuthButtons = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};

export default AuthButtons;
