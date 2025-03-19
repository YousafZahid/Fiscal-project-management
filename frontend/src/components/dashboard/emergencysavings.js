// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import Navbar from "./navbar";
// import { Progress } from "antd"; // Ant Design for progress bar

// const EmergencySavings = () => {
//   const [goalAmount, setGoalAmount] = useState(null);
//   const [monthlyBudget, setMonthlyBudget] = useState(null);
//   const [savedAmount, setSavedAmount] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [nextSavingDate, setNextSavingDate] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [income, setIncome] = useState(0);

//   useEffect(() => {
//     fetchEmergencyFund();
//     fetchIncome();
//   }, []);

//   const fetchEmergencyFund = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const response = await axiosInstance.get("emergency-fund/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setGoalAmount(response.data.goal_amount);
//       setMonthlyBudget(response.data.monthly_budget);
//       setSavedAmount(response.data.saved_amount);
//       setNextSavingDate(response.data.next_saving_date);
//       setProgress(response.data.progress);
//       setHistory(response.data.history || []);
//     } catch (error) {
//       console.error("Error fetching emergency fund:", error);
//     }
//   };

//   const fetchIncome = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const response = await axiosInstance.get("income/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setIncome(response.data.total_income);
//     } catch (error) {
//       console.error("Error fetching income:", error);
//     }
//   };

//   const handleSetGoal = async () => {
//     const goal = prompt("Set your emergency fund goal amount:");
//     if (!goal || isNaN(goal)) return;

//     const recommendedBudget = (income * 0.1).toFixed(2);
//     const budget = prompt(
//       `Set your monthly saving budget (Recommended: PKR ${recommendedBudget}):`
//     );

//     if (!budget || isNaN(budget)) return;

//     try {
//       const token = localStorage.getItem("access_token");

//       await axiosInstance.post(
//         "emergency-fund/",
//         { goal_amount: goal, monthly_budget: budget },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Goal set successfully!");
//       fetchEmergencyFund();
//     } catch (error) {
//       console.error("Error setting goal:", error);
//       alert(error.response?.data?.error || "An error occurred");
//     }
//   };

//   const handleSaveMoney = async () => {
//     const saved = prompt("Enter amount saved this month:");

//     if (!saved || isNaN(saved)) return;

//     try {
//       const token = localStorage.getItem("access_token");

//       await axiosInstance.put(
//         "emergency-fund/",
//         { saved_amount: saved },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Savings updated!");
//       fetchEmergencyFund();
//     } catch (error) {
//       console.error("Error saving money:", error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div style={styles.emergencyContainer}>
        

//         {/* Goal, Monthly Budget, and Saved Amount Cards */}
//         <div style={styles.cardsContainer}>
//           <div style={styles.card}>
//             <h3>Goal Amount</h3>
//             <p style={styles.amount}>PKR {goalAmount || "Not Set"}</p>
//             <button style={styles.editBtn} onClick={handleSetGoal}>
//               Set/Update Goal
//             </button>
//           </div>

//           <div style={styles.card}>
//             <h3>Monthly Saving Target</h3>
//             <p style={styles.amount}>PKR {monthlyBudget || "Not Set"}</p>
//             <p style={styles.dateText}>
//               Next Saving Date: {nextSavingDate || "Not Set"}
//             </p>
//           </div>

//           <div style={styles.card}>
//             <h3>Saved Amount</h3>
//             <p style={styles.amount}>PKR {savedAmount}</p>
//             <Progress percent={progress} status="active" />
//             <button style={styles.saveBtn} onClick={handleSaveMoney}>
//               Save Money
//             </button>
//           </div>
//         </div>

//         {/* Transaction History */}
//         <div style={styles.historyContainer}>
//           <h3>Savings History</h3>
//           {history.length === 0 ? (
//             <p style={styles.noHistory}>No savings recorded yet.</p>
//           ) : (
//             <table style={styles.historyTable}>
//               <thead>
//                 <tr>
//                   <th style={styles.tableHeader}>Date</th>
//                   <th style={styles.tableHeader}>Saved Amount (PKR)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((entry, index) => (
//                   <tr key={index}>
//                     <td style={styles.tableCell}>{entry.date_saved}</td>
//                     <td style={styles.tableCell}>{entry.saved_amount}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "./navbar";
import { Progress, Modal, Select, Input, Button} from "antd"; // Import Ant Design components

const { Option } = Select;

const EmergencySavings = () => {
  const [goalAmount, setGoalAmount] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(null);
  const [savedAmount, setSavedAmount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [nextSavingDate, setNextSavingDate] = useState(null);
  const [history, setHistory] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenseBudget, setExpenseBudget] = useState(0);
  
  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [customGoal, setCustomGoal] = useState("");
  const [customBudget, setCustomBudget] = useState("");

  useEffect(() => {
    fetchEmergencyFund();
    fetchIncome();
    fetchExpenseBudget();
  }, []);

  // Fetch Emergency Fund Data
  const fetchEmergencyFund = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axiosInstance.get("emergency-fund/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoalAmount(response.data.goal_amount);
      setMonthlyBudget(response.data.monthly_budget);
      setSavedAmount(response.data.saved_amount);
      setNextSavingDate(response.data.next_saving_date);
      setProgress(response.data.progress);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error("Error fetching emergency fund:", error);
    }
  };

  // Fetch User's Income
  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axiosInstance.get("income/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIncome(response.data.total_income);
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  // Fetch User's Expense Budget
  const fetchExpenseBudget = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axiosInstance.get("budget/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenseBudget(response.data.expense_budget);
    } catch (error) {
      console.error("Error fetching expense budget:", error);
    }
  };

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
    const finalGoal = customGoal || expenseBudget * selectedMonths;
    const finalBudget = customBudget || (finalGoal / selectedMonths).toFixed(2);

    if (!finalGoal || !finalBudget || isNaN(finalGoal) || isNaN(finalBudget)) return;

    try {
      const token = localStorage.getItem("access_token");

      await axiosInstance.post(
        "emergency-fund/",
        { goal_amount: finalGoal, monthly_budget: finalBudget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Goal set successfully!");
      fetchEmergencyFund();
      handleCloseModal();
    } catch (error) {
      console.error("Error setting goal:", error);
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  // Handle Saving Money
  const handleSaveMoney = async () => {
    const saved = prompt("Enter amount saved this month:");

    if (!saved || isNaN(saved)) return;

    try {
      const token = localStorage.getItem("access_token");

      await axiosInstance.put(
        "emergency-fund/",
        { saved_amount: saved },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Savings updated!");
      fetchEmergencyFund();
    } catch (error) {
      console.error("Error saving money:", error);
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
            <Progress percent={progress} status="active" />
            <button style={styles.saveBtn} onClick={handleSaveMoney}>
              Save Money
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div style={styles.historyContainer}>
          <h3>Savings History</h3>
          {history.length === 0 ? (
            <p style={styles.noHistory}>No savings recorded yet.</p>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={index}>{`${entry.date_saved}: PKR ${entry.saved_amount}`}</li>
              ))}
            </ul>
          )}
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

// export default EmergencySavings;

// Inline Styles
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
};

export default EmergencySavings;
