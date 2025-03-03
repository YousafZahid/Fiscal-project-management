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
  { path: "/Debts", label: "Debts" },
  { path: "/expencetracking", label: "Expense Tracking" },
  { path: "/Goals", label: "Goals" },
  { path: "/Retirement Plan", label: "Retirement Plan" },
  { path: "/logout", label: "Logout" },
];

// Basic styling for the navbar

const styles = {
  navbar: {
    padding: "20px",
    margin: "20px",
    backgroundColor: "orange",
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
    backgroundColor: "#FD6418",
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
