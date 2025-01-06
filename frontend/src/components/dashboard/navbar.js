import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/emergency-funds" style={styles.navLink}>Emergency Savings</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/Debts" style={styles.navLink}>Debts</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/expence-tracking" style={styles.navLink}>Expense Tracking</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/Goals" style={styles.navLink}>Goals</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/Retirement Plan" style={styles.navLink}>Retirement Plan</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/logout" style={styles.navLink}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

// Basic styling for the navbar
const styles = {
  navbar: {
    backgroundColor: "#007bff",
    padding: "10px 20px",
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
    color: "white",
    fontWeight: "bold",
  },
};

export default Navbar;
