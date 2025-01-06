import React from "react";
import Navbar from "./navbar"; // Import Navbar component

const EmergencySavings = () => {
  return (
    <div>
      <Navbar /> {/* Reusable Navbar */}
      <div style={styles.container}>
        <h1>Emergency Savings Fund</h1>
        <p>Track and manage your emergency savings here.</p>
        {/* Add functionality like setting savings goals or tracking contributions */}
      </div>
    </div>
  );
};

// Basic styling for demonstration
const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
  },
};

export default EmergencySavings;
