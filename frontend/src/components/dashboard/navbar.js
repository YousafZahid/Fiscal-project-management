import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path} style={styles.navItem}>
            <Link
              to={item.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === item.path ? styles.activeLink : {}),
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Navigation links
const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/emergencysavings", label: "Emergency Savings" },
  { path: "/liabilities", label: "Liabilities" },
  { path: "/expencetracking", label: "Expense Tracking" },
  { path: "/Goals", label: "Goals" },
  { path: "/retirement", label: "Retirement Plan" },
  { path: "/logout", label: "Logout" },
];

// Basic styling for the navbar

const styles = {
  navbar: {
    padding: "20px",
    margin: "20px",
    backgroundColor: "#FF9040",
    borderRadius: "15px",
    boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.2)",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-around",
    margin: 0,
    padding: 0,
  },
  navItem: {
     margin: "0 10px",
    
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold",
    padding: "15px 25px",
    borderRadius: "15px",
    transition: "background 0.3s ease, color 0.3s ease",
  },
  activeLink: {
    transition: "1s",
    backgroundColor: "",
    fontWeight: "bold",
    color: "black",
  },
  navLinkHover: {
    transition: "1s",
    backgroundColor: "#FD6418",
    color: "black",
  },
};

export default Navbar;
// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// const Navbar = () => {
//   const location = useLocation();

//   return (
//     <nav className="bg-background shadow-md px-6 py-2 flex justify-between items-center">
//       {/* Left Side - Navigation Links */}
//       <ul className="flex space-x-6">
//         {navItems.map((item) => (
//           <li key={item.path}>
//             <Link
//               to={item.path}
//               className={`text-secondary font-medium hover:text-primary transition duration-300 ${
//                 location.pathname === item.path ? "text-primary font-bold" : ""
//               }`}
//             >
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Right Side - Login & Sign Up (NO GAP, NO ROUNDED CORNERS) */}
//       <div className="flex">
//         <Link
//           to="/login"
//           className="bg-primary text-white px-4 py-2 font-semibold border-none rounded-none"
//         >
//           Login
//         </Link>
//         <Link
//           to="/signup"
//           className="bg-secondary text-white px-4 py-2 font-semibold border-none rounded-none"
//         >
//           Sign Up
//         </Link>
//       </div>
//     </nav>
//   );
// };

// // Navigation Links
// const navItems = [
//   { path: "/dashboard", label: "Dashboard" },
//   { path: "/emergencysavings", label: "Emergency Savings" },
//   { path: "/debts", label: "Debts" },
//   { path: "/expensetracking", label: "Expense Tracking" },
//   { path: "/goals", label: "Goals" },
//   { path: "/retirement", label: "Retirement Plan" },
//   { path: "/about", label: "About" }, // Normal links now
//   { path: "/features", label: "Features" }, // Normal links now
// ];

// export default Navbar;
