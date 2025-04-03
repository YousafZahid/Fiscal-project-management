import React, { useState } from "react";
import Navbar from "./navbar";
import CurrencySelect from "./currencyselect";
import axiosInstance from "../../api/axiosInstance";

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
  const [errors, setErrors] = useState({});
  const sections = ["Personal Details", "Annual Income", "Assets", "Liabilities", "Expenses"];
  // const [message, setMessage] = useState("");


  const validateField = (section, key, value) => {
    const newErrors = { ...errors };
    let errorMessage = "";

    switch (section) {
      case "personalDetails":
        if (key === "age" && (!value || value <= 0)) errorMessage = "Age must be greater than 0.";
        if (key === "maritalStatus" && !value) errorMessage = "Marital Status is required.";
        if (key === "numberOfChildren" && value && value < 0)
          errorMessage = "Number of children must be a positive value.";
        break;

      case "annualIncome":
        if (key === "category" && (!value || value !== "Select Category")) errorMessage = "Category is required.";
        if (key === "frequency" && !value) errorMessage = "Frequency is required.";
        if (key === "amount" &&  value <= 0)
          errorMessage = "Amount must be a positive value.";
        break;

      case "assets":
        if (key === "category" && (!value || value === "Select Category")) errorMessage = "Category is required.";
        if (key === "amount" && (!value || value <= 0)) errorMessage = "Amount must be a positive value.";
        break;

      case "liabilities":
        if (key === "category" && (!value || value === "Select Category")) errorMessage = "Category is required.";
        if (key === "loanAmount" && value && value <= 0) errorMessage = "Loan Amount must be positive.";
        if (key === "interestRate" && value && value < 0)
          errorMessage = "Interest Rate must be a positive value.";
        if (key === "loanTerm" && !value) errorMessage = "Loan Term is required.";
        if (key === "monthlyPayment" && (!value || value <= 0))
          errorMessage = "Monthly Payment must be positive.";
        if (key === "remainingBalance" && (!value || value <= 0))
          errorMessage = "Remaining Balance must be positive.";
        if (["startDate", "dueDate"].includes(key)) {
          const selectedDate = new Date(value);
          const today = new Date();
          if (selectedDate < today) errorMessage = `${key === "startDate" ? "Start" : "Due"} Date cannot be in the past.`;
        }
        break;

      case "expenses":
        if (key === "category" && (!value || value === "Select Category")) errorMessage = "Category is required.";
        if (key === "amount" && (!value || value <= 0)) errorMessage = "Amount must be positive.";
        break;

      default:
        break;
    }

    // Update errors state
    if (errorMessage) {
      newErrors[section] = newErrors[section] || {};
      newErrors[section][key] = errorMessage;
    } else if (newErrors[section]?.[key]) {
      delete newErrors[section][key];
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e, section, index, key) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      const updatedArray = [...formData[section]];
      updatedArray[index][name] = value;
      setFormData({ ...formData, [section]: updatedArray });
      validateField(section, name, value);
    } else {
      setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
      validateField(section, name, value);
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

  const renderErrors = (section, key) => {
    if (errors[section]?.[key]) {
      return <p style={styles.error}>{errors[section][key]}</p>;
    }
    return null;
  };

  const handleNext = () => setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  const handleBack = () => setCurrentSection((prev) => Math.max(prev - 1, 0));
 
const handleSubmit = async () => {
 
  try {
    
    const token = localStorage.getItem("access_token"); // Get the token from local storage
    const response = await axiosInstance.post("save-user-data/", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
    });
    console.log("Data saved successfully:", response.data);
    alert("Data saved successfully!");
  } catch (error) {
    console.error("Error submitting data:", error.response?.data || error.message);
    // setMessage("Failed to submit data. Please try again.");
  }
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
               {renderErrors("personalDetails", "age")}
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
              {renderErrors("personalDetails", "maritalStatus")}
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
              {renderErrors("personalDetails", "numberOfChildren")}

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
                {renderErrors("annualIncome", `category_${index}`)}
                <select
                  name="frequency"
                  value={income.frequency || ""}
                  onChange={(e) => handleInputChange(e, "annualIncome", index)}
                  style={styles.input}
                >
                  <option value="">Select Frequency</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Annually">Annually</option>
                </select>
                {renderErrors("annualIncome", `frequency_${index}`)}
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={income.amount || ""}
                  onChange={(e) => handleInputChange(e, "annualIncome", index)}
                  style={styles.input}
                />
                {renderErrors("annualIncome", `amount_${index}`)}
                <CurrencySelect
                  name="passiveIncomeCurrency"
                  value={formData.passiveIncomeCurrency || ""}
                  onChange={(e) => handleInputChange(e, "income")}
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
            <button onClick={() => addItem("annualIncome", { category: "", frequency: "", amount: "", description: "" })} className="bg-orange-100 text-orange-700 px-5 py-2 rounded-md hover:bg-orange-200 transition block mx-auto">
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
                {renderErrors("assets", `category_${index}`)}
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
                 {renderErrors("assets", `amount_${index}`)}
                <CurrencySelect
                  name="currency"
                  value={asset.currency || "PKR"}
                  onChange={(e) => handleInputChange(e, "assets", index)}
                />
                <button onClick={() => removeItem("assets", index)}>Remove</button>
              </div>
            ))}
            <button onClick={() => addItem("assets", { category: "", description: "", amount: "",currency: "PKR" })} className="bg-orange-100 text-orange-700 px-5 py-2 rounded-md hover:bg-orange-200 transition block mx-auto">
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
                    <option value="Loan">Loan</option>
                    <option value="Credit Card Debt">Credit Card Debt</option>
                    <option value="Mortgage">Mortgage</option>
                  </select>
                  {renderErrors("liabilities", `category_${index}`)}

                

                  {/* Loan Information */}
                  {liability.category === "Loan" && (
                    <>
                      <input
                        type="number"
                        name="loanAmount"
                        placeholder="Loan Amount"
                        value={liability.loanAmount || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `loanAmount_${index}`)}
                      <input
                        type="number"
                        name="interestRate"
                        placeholder="Interest Rate (%)"
                        value={liability.interestRate || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `interestRate_${index}`)}
                      <input
                        type="text"
                        name="loanTerm"
                        placeholder="Loan Term (Months/Years)"
                        value={liability.loanTerm || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `loanTerm_${index}`)}

                      <input
                        type="number"
                        name="monthlyPayment"
                        placeholder="Monthly Payment"
                        value={liability.monthlyPayment || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `monthlyPayment_${index}`)}
                      <input
                        type="number"
                        name="remainingBalance"
                        placeholder="Remaining Balance"
                        value={liability.remainingBalance || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `remainingBalance_${index}`)}
                      <input
                        type="date"
                        name="startDate"
                        placeholder="Enter Start Date (e.g., 2025-01-01)"
                        value={liability.startDate || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `startDate_${index}`)}
                      <input
                        type="date"
                        name="dueDate"
                        placeholder="Enter Due Date (e.g., 2025-12-31)"
                        value={liability.dueDate || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                       {renderErrors("liabilities", `dueDate_${index}`)}
                    </>
                  )}
        
                  {/* Credit Card Debt */}
                  {liability.category === "Credit Card Debt" && (
                    <>
                      <input
                        type="number"
                        name="creditCardBalance"
                        placeholder="Credit Card Balance"
                        value={liability.creditCardBalance || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `creditCardBalance_${index}`)}

                      <input
                        type="number"
                        name="creditCardAPR"
                        placeholder="Interest Rate (APR %)"
                        value={liability.creditCardAPR || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `creditCardAPR_${index}`)}
                      <input
                        type="number"
                        name="minimumPayment"
                        placeholder="Minimum Payment"
                        value={liability.minimumPayment || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />

                      {renderErrors("liabilities", `minimumPayment_${index}`)}

                      <input
                        type="number"
                        name="monthlyPayment"
                        placeholder="Monthly Payment"
                        value={liability.monthlyPayment || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `monthlyPayment_${index}`)}
                      <input
                        type="number"
                        name="creditLimit"
                        placeholder="Credit Limit"
                        value={liability.creditLimit || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `creditLimit_${index}`)}

                      <input
                        type="number"
                        name="revolvingBalance"
                        placeholder="Revolving Balance"
                        value={liability.revolvingBalance || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `revolvingBalance_${index}`)}
                    </>
                  )}
        
                  {/* Mortgage */}
                  {liability.category === "Mortgage" && (
                    <>
                      <input
                        type="number"
                        name="mortgageAmount"
                        placeholder="Original Mortgage Amount"
                        value={liability.mortgageAmount || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `mortgageAmount_${index}`)}
                      <input
                        type="number"
                        name="mortgageInterestRate"
                        placeholder="Interest Rate (%)"
                        value={liability.mortgageInterestRate || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `mortgageInterestRate_${index}`)}


                      <input
                        type="text"
                        name="mortgageTermLength"
                        placeholder="Term Length (Years)"
                        value={liability.mortgageTermLength || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `mortgageTermLength_${index}`)}

                      <input
                        type="number"
                        name="mortgageMonthlyPayment"
                        placeholder="Monthly Payment"
                        value={liability.mortgageMonthlyPayment || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `mortgageMonthlyPayment_${index}`)}

                      <input
                        type="number"
                        name="mortgageRemainingBalance"
                        placeholder="Remaining Balance"
                        value={liability.mortgageRemainingBalance || ""}
                        onChange={(e) => handleInputChange(e, "liabilities", index)}
                        style={styles.input}
                      />
                      {renderErrors("liabilities", `mortgageRemainingBalance_${index}`)}
                    </>
                  )}
        
                  <button onClick={() => removeItem("liabilities", index)} className="bg-orange-100 text-orange-700 px-5 py-2 rounded-md hover:bg-orange-200 transition block mx-auto">Remove</button>
                </div>
              ))}
              <button
                onClick={() =>
                  addItem("liabilities", {
                    category: "",
                    loanAmount: "",
                    interestRate: "",
                    loanTerm: "",
                    monthlyPayment: "",
                    remainingBalance: "",
                    startDate: "",
                    dueDate: "",
                    creditCardBalance: "",
                    creditCardAPR: "",
                    minimumPayment: "",
                    creditLimit: "",
                    revolvingBalance: "",
                    mortgageAmount: "",
                    mortgageInterestRate: "",
                    mortgageTermLength: "",
                    mortgageMonthlyPayment: "",
                    mortgageRemainingBalance: "",
                    propertyTaxes: "",
                    homeInsurance: "",
                  })
                } className="bg-orange-100 text-orange-700 px-5 py-2 rounded-md hover:bg-orange-200 transition block mx-auto"
              >
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
                    <button onClick={() => addItem("expenses", { category: "", description: "", amount: "" })} className="bg-orange-100 text-orange-700 px-5 py-2 rounded-md hover:bg-orange-200 transition block mx-auto">
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
    <div className="bg-orange-50 min-h-screen flex flex-col">
      <Navbar />
      <h1 className="text-3xl font-bold text-center self-center text-gray-800 mb-6">Dashboard</h1>
      {!showPopup ? (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-700">Start Your Journey</h2>
      <button 
        onClick={() => setShowPopup(true)} 
        className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
      >
        Start
      </button>
    </div>
  ) : (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-700">{sections[currentSection]}</h2>

      {renderSection()}

      <div className="mt-6 flex justify-between">
        <button 
          onClick={handleBack} 
          disabled={currentSection === 0}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition disabled:opacity-50"
        >
          Back
        </button>

        {currentSection < sections.length - 1 ? (
          <button 
            onClick={handleNext} 
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Submit
          </button>
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
  error: { 
    color: "red", 
    fontSize: "12px", 
    marginTop: "5px" 
  },
  item: {
    marginBottom: "10px",
   },
  navigation: {
    marginTop: "20px",
  },
};

export default Dashboard;
