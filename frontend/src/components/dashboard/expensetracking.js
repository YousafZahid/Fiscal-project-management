import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import axiosInstance from "../../api/axiosInstance";

const ExpenseTracking = () => {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  useEffect(() => {
    fetchBudget();
    fetchExpenses();
    
     // Fetch data only once on component mount
  }, []); 

  useEffect(() => {
    calculateRemainingBudget(); // Update remaining budget when budget or totalExpenses change
  }, [budget, totalExpenses]);
  
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found. Please login.");
        return;
      }
      
      const response = await axiosInstance.get("expenses/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setExpenses(response.data.expenses || []); // Use response.data.expenses instead of response.data
      setTotalExpenses(response.data.total_expenses || 0);
    } catch (error) {
      console.error("Error fetching expenses:", error.response);
    }
  };

  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token){
        console.error("No access token found. Please Login. ");
        return;
      }
      const response = await axiosInstance.get("budget/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBudget(response.data.expense_budget);
    } catch (error) {
      console.error("Error fetching budget:", error.response);
    }
  };
  
  // Handle adding/updating the budget

const handleBudgetChange = async () => {
  const newBudget = prompt("Enter your expense budget:");
  if (newBudget && !isNaN(newBudget)) {
    const budgetValue = parseFloat(newBudget);
    setBudget(budgetValue);
    const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found. Please login.");
        return;
      }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found. Please login.");
        return;
      }

      // First, check if a budget already exists
      const response = await axiosInstance.get("budget/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        // If a budget exists, use PUT to update it
        await axiosInstance.put(
          "budget/",
          { expense_budget: budgetValue },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Budget updated successfully!");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If budget does not exist, use POST to create a new one
        try {
          await axiosInstance.post(
            "budget/",
            { expense_budget: budgetValue },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Budget created successfully!");
        } catch (postError) {
          console.error("Error creating budget:", postError);
        }
      } else {
        console.error("Error checking budget:", error);
      }
    }
  }
};


  
  // Calculate remaining budget
  const calculateRemainingBudget = () => {
    if (budget !== null) {
      setRemainingBudget(budget - totalExpenses);
    }
  };

  // Add a new expense
  const addExpense = async () => {
    const category = prompt("Enter expense category:");
    const description = prompt("Enter expense description:");
    const amount = prompt("Enter expense amount:");
    if (category && description && amount && !isNaN(amount)) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axiosInstance.post("add-expense/", {
          category,
          description,
          amount: parseFloat(amount)},
          {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },        
        });
        setExpenses([...expenses, response.data]);
        
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    }
  };

  // Update an expense
  const updateExpense = async (id) => {
    const updatedDescription = prompt("Enter updated description:");
    const updatedAmount = prompt("Enter updated amount:");

    if (updatedDescription && updatedAmount && !isNaN(updatedAmount)) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found. Please login.");
          return;
        }
        await axiosInstance.put(
          `update-expense/${id}/`, 
          {
            description: updatedDescription,
            amount: parseFloat(updatedAmount),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the header
            },
          }
        );

        fetchExpenses(); // Refresh expenses
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found. Please login.");
        return;
      }

      await axiosInstance.delete(
        `delete-expense/${id}/`, 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );
      
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
};


  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        
        <div style={styles.budgetContainer}>
          {/* Budget Box */}
        <div style={styles.box} onClick={handleBudgetChange}>
          {budget === null || isNaN(budget) ? (
            <p style={styles.addText}>Add Budget</p>
          ) : (
            <>
              <p style={styles.valueText}>{`Budget: PKR ${Number(budget).toFixed(2)}`}</p>
              <p style={styles.updateText}>Update</p>
            </>
          )}
        </div>


          {/* Total Expenses Box */}
          <div style={styles.box}>
            <p style={styles.valueText}>{`Total Expenses: PKR ${totalExpenses.toFixed(2)}`}</p>
          </div>

          {/* Remaining Budget Box */}
          <div style={styles.box}>
            <p style={styles.valueText}>{`Remaining Budget: PKR ${remainingBudget.toFixed(2)}`}</p>
          </div>
        </div>

        {/* Expense List */}
        <div style={styles.expenseList}>
          <h3>Expenses</h3>
          <button style={styles.addExpenseButton} onClick={addExpense}>
            Add Expense
          </button>
          {expenses.map((expense) => (
            <div key={expense.id} style={styles.expenseItem}>
              <div>
                <strong>{expense.category}</strong> - {expense.description}
                <p>{`Amount: PKR ${expense.amount}`}</p>
              </div>
              <div>
                <button style={styles.actionButton} onClick={() => updateExpense(expense.id)}>
                  Update
                </button>
                <button style={styles.actionButton} onClick={() => deleteExpense(expense.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
  },
  budgetContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "80px",
  },
  box: {
    width: "200px",
    height: "100px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    backgroundColor: "#white",
  },
  addText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#888",
  },
  valueText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  updateText: {
    fontSize: "20px",
    color: "black",
    marginTop: "5px",
    fontWeight: "bold",
  },
  expenseList: {
    marginTop: "30px",
  },
  expenseItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  actionButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "12px",
  },
  addExpenseButton: {
    marginBottom: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ExpenseTracking;


// save budget value in database
// check for any errors
// add subcategories
// make frontend better
// add a functionality to track for total monthly expenses