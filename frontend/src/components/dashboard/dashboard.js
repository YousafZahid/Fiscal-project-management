import React, { useState } from "react";
import Navbar from "./navbar";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false); // Controls the popup visibility
  const [currentSection, setCurrentSection] = useState(0); // Tracks current section
  const [formData, setFormData] = useState({
    personalDetails: { age: "", maritalStatus: "", numberOfChildren: "" },
    annualIncome: [],
    assets: [],
    liabilities: [],
    expenses: [],
  });

  const sections = ["Personal Details", "Annual Income", "Assets", "Liabilities", "Expenses"];

  const handleInputChange = (e, section, index, key) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedArray = [...formData[section]];
      updatedArray[index][name] = value;
      setFormData({ ...formData, [section]: updatedArray });
    } else {
      setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
    }
  };

  const addItem = (section, newItem) => {
    setFormData({ ...formData, [section]: [...formData[section], newItem] });
  };

  const removeItem = (section, index) => {
    const updatedArray = [...formData[section]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [section]: updatedArray });
  };

  const handleNext = () => setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const handleBack = () => setCurrentSection((prev) => Math.max(prev - 1, 0));
  const handleSubmit = () => {
    console.log("Submitted Data: ", formData);
    alert("Journey details submitted successfully!");
    setShowPopup(false);
  };

  const renderSection = () => {
    switch (sections[currentSection]) {
      case "Personal Details":
        return (
          <div>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={formData.personalDetails.age}
                onChange={(e) => handleInputChange(e, "personalDetails")}
                style={styles.input}
              />
            </label>
            <label>
              Marital Status:
              <input
                type="text"
                name="maritalStatus"
                value={formData.personalDetails.maritalStatus}
                onChange={(e) => handleInputChange(e, "personalDetails")}
                style={styles.input}
              />
            </label>
            <label>
              Number of Children:
              <input
                type="number"
                name="numberOfChildren"
                value={formData.personalDetails.numberOfChildren}
                onChange={(e) => handleInputChange(e, "personalDetails")}
                style={styles.input}
              />
            </label>
          </div>
        );

      case "Annual Income":
        return (
          <div>
            <h4>Income Categories</h4>
            {formData.annualIncome.map((income, index) => (
              <div key={index} style={styles.item}>
                <select
                  name="category"
                  value={income.category || ""}
                  onChange={(e) => handleInputChange(e, "annualIncome", index)}
                  style={styles.input}
                >
                  <option value="">Select Category</option>
                  <option value="Direct Income">Direct Income</option>
                  <option value="Passive Income">Passive Income</option>
                  <option value="Other Sources">Other Sources</option>
                </select>
                <input
                  type="text"
                  name="frequency"
                  placeholder="Monthly/Annually"
                  value={income.frequency || ""}
                  onChange={(e) => handleInputChange(e, "annualIncome", index)}
                  style={styles.input}
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={income.amount || ""}
                  onChange={(e) => handleInputChange(e, "annualIncome", index)}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={income.description || ""}
                  onChange={(e) => handleInputChange(e, "annualIncome", index)}
                  style={styles.input}
                />
                <button onClick={() => removeItem("annualIncome", index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addItem("annualIncome", { category: "", frequency: "", amount: "", description: "" })}>
              Add Income
            </button>
          </div>
        );

      case "Assets":
        return (
          <div>
            <h4>Assets</h4>
            {formData.assets.map((asset, index) => (
              <div key={index} style={styles.item}>
                <select
                  name="category"
                  value={asset.category || ""}
                  onChange={(e) => handleInputChange(e, "assets", index)}
                  style={styles.input}
                >
                  <option value="">Select Category</option>
                  <option value="Fixed Assets">Fixed Assets</option>
                  <option value="Liquid Assets">Liquid Assets</option>
                </select>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={asset.description || ""}
                  onChange={(e) => handleInputChange(e, "assets", index)}
                  style={styles.input}
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={asset.amount || ""}
                  onChange={(e) => handleInputChange(e, "assets", index)}
                  style={styles.input}
                />
                <button onClick={() => removeItem("assets", index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addItem("assets", { category: "", description: "", amount: "" })}>
              Add Asset
            </button>
          </div>
        );
        

        case "Liabilities":
            return (
              <div>
                <h4>Liabilities</h4>
                {formData.liabilities.map((liability, index) => (
                  <div key={index} style={styles.item}>
                    <select
                      name="category"
                      value={liability.category || ""}
                      onChange={(e) => handleInputChange(e, "liabilities", index)}
                      style={styles.input}
                    >
                      <option value="">Select Category</option>
                      <option value="Loans">Loans</option>
                      <option value="Credit Card Debt">Credit Card Debt</option>
                      <option value="Mortgages">Mortgages</option>
                    </select>
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={liability.description || ""}
                      onChange={(e) => handleInputChange(e, "liabilities", index)}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount"
                      value={liability.amount || ""}
                      onChange={(e) => handleInputChange(e, "liabilities", index)}
                      style={styles.input}
                    />
                    <input
                      type="number"
                      name="interestRate"
                      placeholder="Interest Rate"
                      value={liability.interestRate || ""}
                      onChange={(e) => handleInputChange(e, "liabilities", index)}
                      style={styles.input}
                    />
                    <button onClick={() => removeItem("liabilities", index)}>Remove</button>
                  </div>
                ))}
                <button onClick={() => addItem("liabilities", { category: "", description: "", amount: "", interestRate: "" })}>
                  Add Liability
                </button>
              </div>
            );
    
            case "Expenses":
                return (
                  <div>
                    <h4>Expenses</h4>
                    {formData.expenses.map((expense, index) => (
                      <div key={index} style={styles.item}>
                        <select
                          name="category"
                          value={expense.category || ""}
                          onChange={(e) => handleInputChange(e, "expenses", index)}
                          style={styles.input}
                        >
                          <option value="">Select Category</option>
                          <option value="Fixed Expenses">Fixed Expenses</option>
                          <option value="Variable Expenses">Variable Expenses</option>
                        </select>
                        <input
                          type="text"
                          name="description"
                          placeholder="Description"
                          value={expense.description || ""}
                          onChange={(e) => handleInputChange(e, "expenses", index)}
                          style={styles.input}
                        />
                        <input
                          type="number"
                          name="amount"
                          placeholder="Amount"
                          value={expense.amount || ""}
                          onChange={(e) => handleInputChange(e, "expenses", index)}
                          style={styles.input}
                        />
                        <button onClick={() => removeItem("expenses", index)}>Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addItem("expenses", { category: "", description: "", amount: "" })}>
                      Add Expense
                    </button>
                  </div>
                );
        

      // Add cases for "Liabilities" and "Expenses" similar to above sections
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1>Dashboard</h1>
      {!showPopup ? (
        <div>
          <h2>Start Your Journey</h2>
          <button onClick={() => setShowPopup(true)}>Start</button>
        </div>
      ) : (
        <div style={styles.popup}>
          <h2>{sections[currentSection]}</h2>
          {renderSection()}
          <div style={styles.navigation}>
            <button onClick={handleBack} disabled={currentSection === 0}>
              Back
            </button>
            {currentSection < sections.length - 1 ? (
              <button onClick={handleNext}>Next</button>
            ) : (
              <button onClick={handleSubmit}>Submit</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
  },
  popup: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    width: "80%",
    margin: "0 auto",
  },
  input: {
    display: "block",
    marginBottom: "10px",
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  item: {
    marginBottom: "10px",
  },
  navigation: {
    marginTop: "20px",
  },
};

export default Dashboard;
