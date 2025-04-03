// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../api/axiosInstance";

// const Signup = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
  
//     try {
//       // Sending signup request to Django backend
//       await axiosInstance.post("signup/", { username, email, password });
//       setMessage("Signup successful! Please check your email for verification.");
//       // Redirecting after successful signup
//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
//     } catch (error) {
//       if (error.response) {
//           console.error("Error response:", error.response.data);
//           setMessage(error.response.data.detail || "Error during signup.");
//       } else {
//           console.error("Error:", error.message);
//           setMessage("Error during signup. Please try again.");
//       }
//   }
//   };

//   return (
//     <div>
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Username:</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <label>Email:</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <label>Password:</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Signup</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Signup;

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
      await axiosInstance.post("signup/", { username, email, password });
      setMessage("Signup successful! Please check your email for verification.");
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
    <div className="flex h-screen">
      {/* Left Section - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
  <div className="flex flex-col items-center">
    <img
      src="/images/Signup.png"
      alt="Signup Visual"
      className="w-3/4 h-auto object-cover rounded-lg shadow-lg"
    />
     <p className="text-black font-bold text-lg mt-2 font-sans">Start Your Financial journey!</p>
  </div>
</div>


      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-orange-50">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Signup
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Signup
            </button>
          </form>
          {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
