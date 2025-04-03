// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import Navbar from "./navbar";
// import { Progress, Modal, Select, Input, Button} from "antd"; 

// const { Option } = Select;

// const EmergencySavings = () => {
//   const [goalAmount, setGoalAmount] = useState(null);
//   const [monthlyBudget, setMonthlyBudget] = useState(null);
//   const [savedAmount, setSavedAmount] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [nextSavingDate, setNextSavingDate] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [income, setIncome] = useState(0);
//   const [expenseBudget, setExpenseBudget] = useState(0);
//   //const [isModalOpen, setIsModalOpen] = useState(false);
//   // Modal State
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedMonths, setSelectedMonths] = useState(3);
//   const [customGoal, setCustomGoal] = useState("");
//   const [customBudget, setCustomBudget] = useState("");

//   useEffect(() => {
//     fetchEmergencyFund();
//     //fetchIncome();
//     fetchBudget();
//     fetchEmergencyFundTransactions();
//   }, []);

//   // Fetch Emergency Fund Data
//   const fetchEmergencyFund = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         console.error("No access token found.");
//         return;
//       }
//       const response = await axiosInstance.get("emergencyfund", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setGoalAmount(response.data.goal_amount);
//       setSavedAmount(response.data.saved_amount);
//       setProgress(
//         response.data.goal_amount > 0
//           ? (response.data.saved_amount / response.data.goal_amount) * 100
//           : 0
//       ); 
//     } catch (error) {
//       console.error("Error fetching emergency fund:", error);
//     }
//   };

//   // Fetch User's Budget
//   const fetchBudget = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const response = await axiosInstance.get("budget/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setExpenseBudget(response.data.expense_budget);
//       setMonthlyBudget(response.data.emergency_fund_budget);
//     } catch (error) {
//       console.error("Error fetching expense budget:", error);
//     }
//   };
  
//   // User's transaction history
//   const fetchEmergencyFundTransactions = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         console.error("No access token found.");
//         return;
//       }
//       const response = await axiosInstance.get("emergency-fund-transactions", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setHistory(response.data); // Transactions contain amount_saved and date_saved
//     } catch (error) {
//       console.error("Error fetching emergency fund transactions:", error);
//     }
//   };

//   // Fetch User's Income
//   // const fetchIncome = async () => {
//   //   try {
//   //     const token = localStorage.getItem("access_token");
//   //     if (!token) return;

//   //     const response = await axiosInstance.get("income/", {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });

//   //     setIncome(response.data.total_income);

//   //   } catch (error) {
//   //     console.error("Error fetching income:", error);
//   //   }
//   // };

  

//   // Show Goal Setting Modal
//   const handleOpenGoalModal = () => {
//     setIsModalVisible(true);
//   };

//   // Close Modal
//   const handleCloseModal = () => {
//     setIsModalVisible(false);
//     setCustomGoal("");
//     setCustomBudget("");
//   };

//   // Handle Goal Selection
//   const handleGoalSelection = (months) => {
//     setSelectedMonths(months);
//     setCustomGoal(expenseBudget * months); // Goal should be a multiple of expense budget
//     setCustomBudget((expenseBudget * months) / months); // Recommended Monthly Saving
//   };

//   // Handle Goal Update
//   const handleSetGoal = async () => {

//   const finalGoal = customGoal ? parseFloat(customGoal) : expenseBudget * selectedMonths;
//   const finalBudget = customBudget ? parseFloat(customBudget) : (finalGoal / selectedMonths).toFixed(2);

//   if (!finalGoal || !finalBudget || isNaN(finalGoal) || isNaN(finalBudget)) {
//     alert("Invalid input. Please enter valid numbers.");
//     return;
//   }

//   try {
//     const token = localStorage.getItem("access_token");

//     const fundResponse = await axiosInstance.post("emergencyfund/", { goal_amount: finalGoal, saved_amount: 0 }, { headers: { Authorization: `Bearer ${token}` } });
//     console.log("Emergency Fund Response:", fundResponse.data);

//     const budgetResponse = await axiosInstance.post("budget/", { emergency_fund_budget: finalBudget }, { headers: { Authorization: `Bearer ${token}` } });
//     console.log("Budget Response:", budgetResponse.data);

//     alert("Goal set successfully!");
//     fetchEmergencyFund();
//     fetchBudget();  // Ensure budget is also updated
//     handleCloseModal();
//   } catch (error) {
//     console.error("Error setting goal:", error);
//     alert(error.response?.data?.error || "An error occurred");
//   }
// };

//   // Handle Saving Money
//  const handleSaveMoney = async () => {
//   const saveOption = window.confirm(
//     `Do you want to save the monthly budget amount (PKR ${monthlyBudget})? Click 'OK' for monthly budget or 'Cancel' to enter a custom amount.`
//   );

//   let savedAmount;
//   if (saveOption) {
//     savedAmount = monthlyBudget;
//   } else {
//     const customAmount = prompt("Enter the amount you want to save:");
//     if (!customAmount || isNaN(customAmount) || parseFloat(customAmount) <= 0) {
//       alert("Invalid amount. Please enter a valid number.");
//       return;
//     }
//     savedAmount = parseFloat(customAmount);
//   }

//   try {
//     const token = localStorage.getItem("access_token");

//     // Fetch the emergency fund ID dynamically
//     const emergencyFundResponse = await axiosInstance.get("emergency-funds/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!emergencyFundResponse.data.length) {
//       alert("No emergency fund found for this user.");
//       return;
//     }

//     const emergencyFundId = emergencyFundResponse.data[0].id; // Assuming user has at least one emergency fund

//     // Send the transaction request
//     await axiosInstance.post(
//       "emergency-fund-transactions/",
//       {
//         amount_saved: savedAmount,
//         emergency_fund: emergencyFundId, // ✅ Use the dynamically fetched ID
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     alert("Savings updated!");
//     fetchEmergencyFund();
//   } catch (error) {
//     console.error("Error saving money:", error);
//     alert(error.response?.data?.error || "An error occurred while saving.");
//   }
// };


//   return (
//     <div className="min-h-screen bg-gray-100">
//     <Navbar />
//     <div className="max-w-4xl mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Emergency Savings</h2>
  
//       {/* Goal, Monthly Budget, and Saved Amount Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-orange-50 p-4 rounded-lg shadow">
//           <h3 className="text-lg font-medium text-gray-700">Goal Amount</h3>
//           <p className="text-xl font-bold text-orange-600">PKR {goalAmount || "Not Set"}</p>
//           <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition" 
//             onClick={handleOpenGoalModal}>
//             Set/Update Goal
//           </button>
//         </div>
  
//         <div className="bg-blue-50 p-4 rounded-lg shadow">
//           <h3 className="text-lg font-medium text-gray-700">Monthly Saving Target</h3>
//           <p className="text-xl font-bold text-blue-600">PKR {monthlyBudget || "Not Set"}</p>
//           <p className="text-sm text-gray-500">Next Saving Date: {nextSavingDate || "Not Set"}</p>
//         </div>
  
//         <div className="bg-green-50 p-4 rounded-lg shadow">
//           <h3 className="text-lg font-medium text-gray-700">Saved Amount</h3>
//           <p className="text-xl font-bold text-green-600">PKR {savedAmount}</p>
//           <Progress percent={progress.toFixed(1)} status="active" />
//           <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//             onClick={handleSaveMoney}>
//             Save Money
//           </button>
//         </div>
//       </div>
  
//       {/* Transaction History */}
//       <div className="mt-8 p-4 bg-white shadow rounded-lg">
//         <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Savings History</h3>
//         {history.length === 0 ? (
//           <p className="text-gray-500">No savings recorded yet.</p>
//         ) : (
//           <ul className="list-disc list-inside text-gray-700">
//             {history.map((entry, index) => (
//               <li key={index}>{`${entry.date_saved}: PKR ${entry.saved_amount}`}</li>
//             ))}
//           </ul>
//         )}
//       </div>
  
//       {/* Goal Setting Modal */}
//       <Modal title="Set Your Emergency Fund Goal" open={isModalVisible} onCancel={handleCloseModal} onOk={handleSetGoal}>
//         <p className="text-gray-600">The goal amount should be a multiple of your expense budget.</p>
//         <p className="text-gray-700 font-semibold">Expense Budget: PKR {expenseBudget}</p>
        
//         <h4 className="mt-4 font-medium text-gray-700">Select Recommended Saving Duration:</h4>
//         <Select value={selectedMonths} onChange={handleGoalSelection} className="w-full mb-4">
//           {[3, 4, 5, 6].map((month) => (
//             <Option key={month} value={month}>
//               {month} Months (Goal: PKR {expenseBudget * month})
//             </Option>
//           ))}
//         </Select>
  
//         <h4 className="font-medium text-gray-700">Or Enter a Custom Goal:</h4>
//         <Input type="number" placeholder="Custom Goal" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} className="mb-3" />
  
//         <h4 className="font-medium text-gray-700">Monthly Saving Amount:</h4>
//         <Input type="number" placeholder="Monthly Budget" value={customBudget} onChange={(e) => setCustomBudget(e.target.value)} />
//       </Modal>
//     </div>
//   </div>
  
//   );
// };


// const styles = {
//   emergencyContainer: {
//     textAlign: "center",
//     marginTop: "20px",
//   },
//   cardsContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "20px",
//     marginTop: "20px",
//   },
//   card: {
//     background: "#ffffff",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     padding: "20px",
//     width: "250px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     textAlign: "center",
//     marginTop: "30px",
//   },
//   amount: {
//     fontSize: "22px",
//     fontWeight: "bold",
//     color: "#007bff",
//   },
//   dateText: {
//     fontSize: "14px",
//     color: "#777",
//     marginTop: "5px",
//   },
//   editBtn: {
//     marginTop: "10px",
//     padding: "8px 15px",
//     fontSize: "14px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     backgroundColor: "#007bff",
//     color: "#fff",
//   },
//   saveBtn: {
//     marginTop: "10px",
//     padding: "8px 15px",
//     fontSize: "14px",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     backgroundColor: "#28a745",
//     color: "#fff",
//   },
//   historyContainer: {
//     marginTop: "40px",
//     textAlign: "center",
//   },
//   historyTable: {
//     width: "60%",
//     margin: "0 auto",
//     borderCollapse: "collapse",
//   },
//   tableHeader: {
//     backgroundColor: "#f8f9fa",
//     border: "1px solid #ddd",
//     padding: "10px",
//   },
//   tableCell: {
//     border: "1px solid #ddd",
//     padding: "10px",
//     textAlign: "center",
//   },
//   noHistory: {
//     color: "#777",
//     fontSize: "14px",
//   },
// };

// export default EmergencySavings;
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "./navbar";
import { Progress, Modal, Select, Input} from "antd"; 

const { Option } = Select;

const EmergencySavings = () => {
  const [goalAmount, setGoalAmount] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(null);
  const [savedAmount, setSavedAmount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [nextSavingDate, setNextSavingDate] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [expenseBudget, setExpenseBudget] = useState(0);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [customGoal, setCustomGoal] = useState("");
  const [customBudget, setCustomBudget] = useState("");

  useEffect(() => {
    fetchEmergencyFund();
    //fetchIncome();
    fetchBudget();
    fetchEmergencyFundTransactions();
    
  }, []);

  // Fetch Emergency Fund Data
  const fetchEmergencyFund = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found.");
        return;
      }
      const response = await axiosInstance.get("emergencyfund", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoalAmount(response.data.goal_amount);
      setSavedAmount(response.data.saved_amount);
      setProgress(
        response.data.goal_amount > 0
          ? (response.data.saved_amount / response.data.goal_amount) * 100
          : 0
      ); 
    } catch (error) {
      console.error("Error fetching emergency fund:", error);
    }
  };

  // Fetch User's Budget
  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axiosInstance.get("budget/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenseBudget(response.data.expense_budget);
      setMonthlyBudget(response.data.emergency_fund_budget);
    } catch (error) {
      console.error("Error fetching expense budget:", error);
    }
  };
  
  // User's transaction history
  const fetchEmergencyFundTransactions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found.");
        return;
      }
      const response = await axiosInstance.get("emergency-fund-transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(response.data); // Transactions contain amount_saved and date_saved
    } catch (error) {
      console.error("Error fetching emergency fund transactions:", error);
    }
  };

  // Fetch User's Income
  // const fetchIncome = async () => {
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     if (!token) return;

  //     const response = await axiosInstance.get("income/", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setIncome(response.data.total_income);

  //   } catch (error) {
  //     console.error("Error fetching income:", error);
  //   }
  // };

  

  // Show Goal Setting Modal
  const handleOpenGoalModal = () => {
    setIsModalVisible(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCustomGoal("");
    setCustomBudget("");
  };

  // Handle Goal Selection
  const handleGoalSelection = (months) => {
    setSelectedMonths(months);
    setCustomGoal(expenseBudget * months); // Goal should be a multiple of expense budget
    setCustomBudget((expenseBudget * months) / months); // Recommended Monthly Saving
  };

  // Handle Goal Update
  const handleSetGoal = async () => {

  const finalGoal = customGoal ? parseFloat(customGoal) : expenseBudget * selectedMonths;
  const finalBudget = customBudget ? parseFloat(customBudget) : (finalGoal / selectedMonths).toFixed(2);

  if (!finalGoal || !finalBudget || isNaN(finalGoal) || isNaN(finalBudget)) {
    alert("Invalid input. Please enter valid numbers.");
    return;
  }

  try {
    const token = localStorage.getItem("access_token");

    const fundResponse = await axiosInstance.post("emergencyfund/", { goal_amount: finalGoal, saved_amount: 0 }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Emergency Fund Response:", fundResponse.data);

    const budgetResponse = await axiosInstance.post("budget/", { emergency_fund_budget: finalBudget }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("Budget Response:", budgetResponse.data);

    alert("Goal set successfully!");
    fetchEmergencyFund();
    fetchBudget();  // Ensure budget is also updated
    handleCloseModal();
  } catch (error) {
    console.error("Error setting goal:", error);
    alert(error.response?.data?.error || "An error occurred");
  }
};

const handleSaveMoney = async () => {
  const saveOption = window.confirm(
    `Do you want to save the monthly budget amount (PKR ${monthlyBudget})? Click 'OK' for monthly budget or 'Cancel' to enter a custom amount.`
  );

  let amountToSave;
  if (saveOption) {
    amountToSave = monthlyBudget;
  } else {
    const customAmount = prompt("Enter the amount you want to save:");
    if (!customAmount || isNaN(customAmount) || parseFloat(customAmount) <= 0) {
      alert("Invalid amount. Please enter a valid number.");
      return;
    }
    amountToSave = parseFloat(customAmount);
  }

  try {
    const token = localStorage.getItem("access_token");

    // ✅ Get the emergency fund ID
    const emergencyFundResponse = await axiosInstance.get("emergency-fund-id/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const emergencyFundId = emergencyFundResponse.data.emergency_fund_id;
    if (!emergencyFundId) {
      alert("No emergency fund found for this user.");
      return;
    }

    // ✅ Send transaction request
    await axiosInstance.post(
      "emergency-fund-transactions/",
      { amount_saved: amountToSave, emergency_fund: emergencyFundId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
      await axiosInstance.put(
        "emergencyfund/",
        {}
      )
    alert("Savings updated!");

    // ✅ Manually update the savedAmount and progress immediately
    setSavedAmount((prev) => {
      const newSavedAmount = prev + amountToSave;
      setProgress(goalAmount > 0 ? (newSavedAmount / goalAmount) * 100 : 0);
      return newSavedAmount;
    });

    // ✅ Fetch latest data from API
    fetchEmergencyFund();
  } catch (error) {
    console.error("Error saving money:", error);
    alert(error.response?.data?.error || "An error occurred while saving.");
  }
};


  return (
    <div>
      <Navbar />
      <div style={styles.emergencyContainer}>
        <h2>Emergency Savings</h2>

        {/* Goal, Monthly Budget, and Saved Amount Cards */}
        <div style={styles.cardsContainer}>
          <div style={styles.card}>
            <h3>Goal Amount</h3>
            <p style={styles.amount}>PKR {goalAmount || "Not Set"}</p>
            <button style={styles.editBtn} onClick={handleOpenGoalModal}>
              Set/Update Goal
            </button>
          </div>

          <div style={styles.card}>
            <h3>Monthly Saving Target</h3>
            <p style={styles.amount}>PKR {monthlyBudget || "Not Set"}</p>
            <p style={styles.dateText}>
              Next Saving Date: {nextSavingDate || "Not Set"}
            </p>
          </div>

          <div style={styles.card}>
            <h3>Saved Amount</h3>
            <p style={styles.amount}>PKR {savedAmount}</p>
            {/* <Progress percent={progress} status="active" /> */}
            <Progress percent={progress.toFixed(1)} status="active" />
            <button style={styles.saveBtn} onClick={handleSaveMoney}>
              Save Money
            </button>
          </div>
        </div>

        {/* Transaction History */}
        {/* <div style={styles.historyContainer}>
          <h3>Savings History</h3>
          {history.length === 0 ? (
            <p style={styles.noHistory}>No savings recorded yet.</p>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={index}>{`${entry.date_saved}: PKR ${entry.amount_saved}`}</li>
              ))}
            </ul>
          )}
        </div> */}

        <div style={styles.historyWrapper}>
          <div style={styles.historyContainer}>
            <h3 style={styles.historyTitle}>Savings History</h3>
            {history.length === 0 ? (
              <p style={styles.noHistory}>No savings recorded yet.</p>
            ) : (
              <ul style={styles.historyList}>
                {history.map((entry, index) => (
                  <li key={index} style={styles.historyItem}>
                    <span style={styles.date}>{entry.date_saved}</span>
                    <span style={styles.amount}>PKR {entry.amount_saved}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Goal Setting Modal */}
        <Modal title="Set Your Emergency Fund Goal" open={isModalVisible} onCancel={handleCloseModal} onOk={handleSetGoal}>
          <p>The goal amount should be a multiple of your expense budget.</p>
          <p>Expense Budget: PKR {expenseBudget}</p>
          
         
          <h4>Select Recommended Saving Duration:</h4>
          <Select value={selectedMonths} onChange={handleGoalSelection} style={{ width: "100%", marginBottom: "10px" }}>
            {[3, 4, 5, 6].map((month) => (
              <Option key={month} value={month}>
                {month} Months (Goal: PKR {expenseBudget * month})
              </Option>
            ))}
          </Select>

          <h4>Or Enter a Custom Goal:</h4>
          <Input type="number" placeholder="Custom Goal" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} />

          <h4>Monthly Saving Amount:</h4>
          <Input type="number" placeholder="Monthly Budget" value={customBudget} onChange={(e) => setCustomBudget(e.target.value)} />
        </Modal>
      </div>
    </div>
  );
};


const styles = {
  emergencyContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  cardsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    width: "250px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginTop: "30px",
  },
  amount: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#007bff",
  },
  dateText: {
    fontSize: "14px",
    color: "#777",
    marginTop: "5px",
  },
  editBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  saveBtn: {
    marginTop: "10px",
    padding: "8px 15px",
    fontSize: "14px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "#fff",
  },
  historyContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
  historyTable: {
    width: "60%",
    margin: "0 auto",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    padding: "10px",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
  },
  noHistory: {
    color: "#777",
    fontSize: "14px",
  },
  historyWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  historyContainer: {
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "100%",
    maxWidth: "870px",
    textAlign: "center",
  },
  historyTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  noHistory: {
    fontSize: "16px",
    color: "#888",
  },
  historyList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "8px",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
  },
  date: {
    color: "#007bff",
    fontWeight: "bold",
  },
  amount: {
    color: "#28a745",
  },
};

export default EmergencySavings;
