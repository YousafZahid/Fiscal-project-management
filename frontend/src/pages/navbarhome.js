// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();

//   return (
//     <nav className="flex justify-between items-center p-4 shadow-md bg-white">
//       {/* Left: Logo */}
//       <div className="text-2xl font-bold text-gray-900">
//         <h2>My Website</h2>
//       </div>

//       {/* Center: Navigation Links */}
//       <div className="hidden md:flex gap-6 text-gray-700 text-lg">
//         <button
//           onClick={() => navigate("/about")}
//           className="hover:text-orange-500 transition"
//         >
//           About
//         </button>
//         <button
//           onClick={() => navigate("/features")}
//           className="hover:text-orange-500 transition"
//         >
//           Features
//         </button>
//       </div>

//       {/* Right: CTA Buttons */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => navigate("/signup")}
//           className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
//         >
//           Sign Up
//         </button>
//         <button
//           onClick={() => navigate("/login")}
//           className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
//         >
//           Login
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white p-2 h-10 flex justify-between items-center z-50 " >
      {/* Left: Logo */}
      <h2 className="text-xl font-[Great Vibes]  Moments text-gray-900  pl-10">Fiscal</h2>

      {/* Center: Navigation Links (Styled as links but still buttons) */}
      <div className="hidden  md:flex space-x-6 text-secondary text-lg justify-center">
        <button
          onClick={() => navigate("/about")}
          className="hover:text-primary text-lg transition bg-transparent border-none p-0 text-black"
        >
          About
        </button>
        <button
          onClick={() => navigate("/features")}
          className="hover:text-primary text-lg transition bg-transparent border-none p-0 text-black"
        >
          Features
        </button>
      </div>

      {/* Right: Login & Sign Up (No gap, no rounded corners) */}
      <div className="flex gap-0 ml-10 pr-8 ">
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 bg-primary text-white font-inter border"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-5 py-2 bg-secondary text-black font-inter border"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
