// import React, { useState } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post("login/", { username, password });
//       localStorage.setItem("access_token", response.data.access);
//       localStorage.setItem("refresh_token", response.data.refresh);
//       setMessage("Login successful!");
//       navigate("/dashboard");
//     } catch (error) {
//       setMessage("Invalid credentials. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <label>Username:</label>
//         <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         <label>Password:</label>
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Login</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Login;

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
    <div className="flex h-screen">
      {/* Left Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <img
            src="/images/Signup.png"
            alt="Login Visual"
            className="w-3/4 h-auto object-cover rounded-lg "
          />
          <p className="text-black font-bold text-lg mt-2 font-sans">
            Welcome Back! Log in to continue.
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-orange-50">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full max-w-sm mx-auto px-4 py-2 border rounded-md focus:ring focus:ring-orange-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full max-w-sm mx-auto px-4 py-2 border rounded-md focus:ring focus:ring-orange-200"
              />
            </div>
            <button
              type="submit"
              className="w-3/5 mx-auto block bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
            >
              Login
            </button>
          </form>
          {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
