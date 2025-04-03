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
  <div className="bg-gray-100 min-h-screen">
    <Navbar />

  <div className="w-full max-w-4xl mx-auto rounded-none mt-10 px-4">
  {/* Expenses Heading */}
  <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">EXPENSES</h2>

  {/* Budget Summary Boxes */}
  <div className="bg-orange-100 shadow-lg rounded-lg p-6 flex flex-col items-center">
    <div className="flex justify-center gap-8">
      {/* Budget Box */}
      <div className="w-52 h-32 bg-white text-gray-800 rounded-md flex flex-col justify-center items-center shadow-md">
        {budget === null || isNaN(budget) ? (
          <p className="text-lg font-semibold text-gray-500">Add Budget</p>
        ) : (
          <>
            <p className="text-lg font-bold">Budget</p>
            <p className="text-lg  text-blue-500 font-bold">{`PKR ${Number(budget).toFixed(2)}`}</p>
          </>
        )}
      </div>

      {/* Total Expenses Box */}
      <div className="w-52 h-32 bg-white text-gray-800 rounded-md flex flex-col justify-center items-center shadow-md">
        <p className="text-lg font-bold">Total Expenses</p>
        <p className="text-lg text-red-500 font-bold">{`PKR ${totalExpenses.toFixed(2)}`}</p>
      </div>

      {/* Remaining Budget Box */}
      <div className="w-52 h-32 bg-white text-gray-800 rounded-md flex flex-col justify-center items-center shadow-md">
        <p className="text-lg font-bold">Remaining Budget</p>
        <p className="text-lg text-blue-500 font-bold">{`PKR ${remainingBudget.toFixed(2)}`}</p>
      </div>
    </div>

    {/* Button Container Below */}
    <div className="mt-6 flex gap-4">
      <button 
        onClick={handleBudgetChange}
        className="secondary  text-black px-3 py-1 text-sm rounded-md hover:bg-gray-300 transition"
      >
        Update Budget
      </button>
      <button 
        onClick={addExpense}
        className="bg-orange-200 text-orange-700 border-orange-700 px-4 py-1 rounded-md hover:bg-orange-300 transition"
      >
        Add Expense
      </button>
    </div>
  </div>
</div>

     

  



<div className="mt-8 grid  px-6 grid-cols-2 gap-6">
  {/* Fixed Category Expenses */}
  <div className="bg-white p-4 shadow-md rounded-lg">
    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Fixed Expenses</h3>
    {expenses.filter(expense => expense.category==="Fixed").map(expense => (
      <div 
        key={expense.id} 
        className="flex justify-between items-center p-4 border border-orange-200 bg-orange-50 shadow-sm rounded-md"
      >
        <div>
          <strong className="text-orange-700">{expense.category}</strong> - {expense.description}
          <p className="text-gray-600">{`Amount: PKR ${expense.amount}`}</p>
        </div>
        <div>
          <button 
            onClick={() => updateExpense(expense.id)}
            className="bg-white text-orange-700 border border-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 transition mr-2"
          >
            Update
          </button>
          <button 
            onClick={() => deleteExpense(expense.id)}
            className="bg-red-200 text-red-700 border-red-700 px-4 py-2 rounded-md hover:bg-red-300 transition"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Variable Category Expenses */}
  <div className="bg-white p-4 shadow-md rounded-lg">
    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Variable Expenses</h3>
    {expenses.filter(expense => expense.category==="Variable").map(expense => (
      <div 
        key={expense.id} 
        className="flex justify-between items-center p-4 border border-orange-200 bg-orange-50 shadow-sm rounded-md"
      >
        <div>
          <strong className="text-orange-700">{expense.category}</strong> - {expense.description}
          <p className="text-gray-600">{`Amount: PKR ${expense.amount}`}</p>
        </div>
        <div>
          <button 
            onClick={() => updateExpense(expense.id)}
            className="bg-white text-orange-700 border border-orange-700 px-4 py-2 rounded-md hover:bg-orange-200 transition mr-2"
          >
            Update
          </button>
          <button 
            onClick={() => deleteExpense(expense.id)}
            className="bg-red-200 text-red-700  border-red-700 px-4 py-2 rounded-md hover:bg-red-300 transition"
          >
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

// const styles = {
//   container: {
//     textAlign: "center",
//     marginTop: "20px",
//   },
//   budgetContainer: {
//     display: "flex",
//     justifyContent: "center",
//     gap: "20px",
//     marginTop: "80px",
//   },
//   box: {
//     width: "200px",
//     height: "100px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     cursor: "pointer",
//     backgroundColor: "#white",
//   },
//   addText: {
//     fontSize: "20px",
//     fontWeight: "bold",
//     color: "#888",
//   },
//   valueText: {
//     fontSize: "18px",
//     fontWeight: "bold",
//   },
//   updateText: {
//     fontSize: "20px",
//     color: "black",
//     marginTop: "5px",
//     fontWeight: "bold",
//   },
//   expenseList: {
//     marginTop: "30px",
//   },
//   expenseItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     marginBottom: "10px",
//   },
//   actionButton: {
//     marginLeft: "10px",
//     padding: "5px 10px",
//     fontSize: "12px",
//   },
//   addExpenseButton: {
//     marginBottom: "10px",
//     padding: "10px 20px",
//     fontSize: "14px",
//     backgroundColor: "#007BFF",
//     color: "#fff",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//   },
// };

export default ExpenseTracking;


// save budget value in database
// check for any errors
// add subcategories
// make frontend better
// add a functionality to track for total monthly expenses