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
    fetchExpenses(); // Fetch data only once on component mount
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
  
      console.log("API Response:", response.data); // Debugging
  
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
  
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found. Please login.");
          return;
        }
  
        await axiosInstance.post(
          "budget/",
          { expense_budget: budgetValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error saving budget:", error);
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
    <div className="flex flex-col items-center" >
      <Navbar />
     
      
      <div className="w-full max-w-4xl text-center mt-10">
        {/* Budget Boxes */}
        <div className="flex justify-center gap-6 mt-10">
          {/* Budget Box */}
          <div 
            className="w-48 h-24 bg-orange-100 text-gray-800 rounded-lg flex flex-col justify-center items-center shadow-md cursor-pointer hover:bg-orange-200 transition"
            onClick={handleBudgetChange}
          >
            {budget === null || isNaN(budget) ? (
              <p className="text-lg font-semibold text-gray-500">Add Budget</p>
            ) : (
              <>
                <p className="text-lg font-bold">{`Budget: PKR ${Number(budget).toFixed(2)}`}</p>
                <p className="text-sm text-blue-500 mt-1">Update</p>
              </>
            )}
          </div>

          {/* Total Expenses Box */}
          <div className="w-48 h-24 bg-orange-100 text-gray-800 rounded-lg flex flex-col justify-center items-center shadow-md">
            <p className="text-lg font-bold">{`Total Expenses: PKR ${totalExpenses.toFixed(2)}`}</p>
          </div>

          {/* Remaining Budget Box */}
          <div className="w-48 h-24 bg-orange-100 text-gray-800 rounded-lg flex flex-col justify-center items-center shadow-md">
            <p className="text-lg font-bold">{`Remaining Budget: PKR ${remainingBudget.toFixed(2)}`}</p>
          </div>
        </div>

        {/* Expense List */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Expenses</h3>

          {/* Add Expense Button */}
          <button 
            onClick={addExpense}
            className="bg-orange-100 text-orange-700 px-5 py-2 rounded-md hover:bg-orange-200 transition block mx-auto"
          >
            Add Expense
          </button>

          <div className="mt-6 space-y-4">
            {expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex justify-between items-center p-4 border border-orange-200 bg-white shadow-sm rounded-lg"
              >
                <div>
                  <strong className="text-orange-700">{expense.category}</strong> - {expense.description}
                  <p className="text-gray-600">{`Amount: PKR ${expense.amount}`}</p>
                </div>
                <div>
                  {/* Update Button (Secondary) */}
                  <button 
                    onClick={() => updateExpense(expense.id)}
                    className="bg-white text-orange-700 border border-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 transition mr-2"
                  >
                    Update
                  </button>

                  {/* Delete Button (Primary) */}
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="bg-orange-100 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    backgroundColor: "#008080",
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
    fontSize: "12px",
    color: "#007BFF",
    marginTop: "5px",
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