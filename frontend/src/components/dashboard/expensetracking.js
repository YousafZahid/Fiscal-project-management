import React, { useState, useEffect,useRef } from "react";
import Navbar from "./navbar";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional icons, install `lucide-react` or use any other

const ExpenseTracking = () => {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // For updating expense
  const [expenseToUpdate, setExpenseToUpdate] = useState(null); 
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const historyRef = useRef(null);

  const [newExpense, setNewExpense] = useState({
    categoryType: "",
    subcategory: "",
    recurrence: "",
    description: "",
    amount: "",
    date: "",
  });
  const fixedExpenses = {
    "Household": ["House Rent", "House Cleaning", "Security"],
    "Utilities": ["Electricity", "Natural Gas", "Water", "Sewer", "Garbage"],
    "Communication": ["Internet", "Landline/Homephone"],
    "Insurance": ["Insurance"],
    "Subscriptions": ["Netflix", "Spotify", "Other Subscriptions"],
  };
  
  const variableExpenses = {
    "Food & Dining": ["Groceries", "Eating Out", "Coffee"],
    "Transport": ["Fuel", "Public Transport", "Taxi"],
    "Shopping": ["Clothing", "Electronics", "Others"],
    "Entertainment": ["Movies", "Games", "Events"],
    "Medical": ["Medicines", "Doctor Visits"],
    "Travel": ["Flights", "Hotels", "Sightseeing"],
  };


  
  useEffect(() => {
    fetchBudget();
    fetchExpenses();
  }, []);

  useEffect(() => {
    calculateRemainingBudget();
  }, [budget, totalExpenses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("going in useEffect", historyRef);

      if (historyRef.current && !historyRef.current.contains(event.target)) {
        console.log("Outside click detected");
        setShowHistoryModal(false);
      }
    };
  
    if (showHistoryModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHistoryModal]);


  const getExpensesForMonth = (month) => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === month.getMonth() &&
        expenseDate.getFullYear() === month.getFullYear()
      );
    });
  };


  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
  
    // Don’t go before first expense
    const earliestDate = expenses.length > 0 ? new Date(expenses[expenses.length - 1].date) : null;
    if (earliestDate && (previousMonth >= new Date(earliestDate.getFullYear(), earliestDate.getMonth(), 1))) {
      setCurrentMonth(previousMonth);
    }
  };
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
  
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
  
    // Only block if nextMonth is *after* this month
    if (
      nextMonth.getFullYear() < todayYear ||
      (nextMonth.getFullYear() === todayYear && nextMonth.getMonth() <= todayMonth)
    ) {
      setCurrentMonth(nextMonth);
    }
  };

  const prepareGraphData = () => {
    const monthExpenses = getExpensesForMonth(currentMonth);
    if (!monthExpenses.length) return [];
  
    let cumulativeSpent = 0;
  
    // Get the last day that has an expense
    const lastExpenseDate = new Date(
      Math.max(...monthExpenses.map((e) => new Date(e.date)))
    );
    const lastDay = lastExpenseDate.getDate();
  
    const data = [];
  
    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const formattedDate = date.toISOString().split("T")[0];
  
      const dailyExpenses = monthExpenses
        .filter((expense) => expense.date.startsWith(formattedDate))
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
  
      cumulativeSpent += dailyExpenses;
  
      data.push({
        day: `${day}`,
        remaining: budget !== null ? budget - cumulativeSpent : 0,
      });
    }
  
    return data;
  };
  
  
  

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.get("expenses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses((response.data.expenses || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
      setTotalExpenses(response.data.total_expenses || 0);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }

  };

  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.get("budget/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudget(response.data.expense_budget);
    } catch (error) {
      console.error("Error fetching budget:", error);
    }
  };

  const handleBudgetChange = () => {
    setShowBudgetModal(true); // show the new budget modal
  };
  

  const handleBudgetSubmit = async () => {
    const newBudget = parseFloat(newExpense.amount);
    if (newBudget && !isNaN(newBudget)) {
      setBudget(newBudget);
      const token = localStorage.getItem("access_token");

      try {
        const response = await axiosInstance.get("budget/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          await axiosInstance.put(
            "budget/",
            { expense_budget: newBudget },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        if (error.response?.status === 404) {
          await axiosInstance.post(
            "budget/",
            { expense_budget: newBudget },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          console.error("Error checking budget:", error);
        }
      }
      setShowModal(false);
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const calculateRemainingBudget = () => {
    if (budget !== null) {
      setRemainingBudget(budget - totalExpenses);
    }
  };

  const submitExpense = async () => {
    const { categoryType, subcategory, recurrence, description, amount, date } = newExpense;
    if (categoryType && subcategory && amount && date && !isNaN(amount)) {
      try {
        const token = localStorage.getItem("access_token");
        const payload = {
          category: categoryType,
          subcategory: subcategory,
          amount: parseFloat(amount),
          description,
          recurrence: categoryType === "fixed" ? recurrence : null,
          date,
        };

        const response = await axiosInstance.post("add-expense/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setExpenses([...expenses, response.data]);
        setShowModal(false);
        setNewExpense({ categoryType: "", subcategory: "", recurrence: "", description: "", amount: "", date: "" });
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    } else {
      alert("Please fill all required fields.");
    }
  };

  const openUpdateExpenseModal = (expense) => {
    setExpenseToUpdate(expense); // Set the expense to update
    setNewExpense({
      categoryType: expense.category,
      subcategory: expense.subcategory,
      recurrence: expense.recurrence || "",
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
    });
    setShowUpdateModal(true); // Show the update modal
  };

  const updateExpense = async () => {
    const { categoryType, subcategory, recurrence, description, amount, date } = newExpense;
    if (categoryType && subcategory && amount && date && !isNaN(amount)) {
      try {
        const token = localStorage.getItem("access_token");
        const payload = {
          category: categoryType,
          subcategory: subcategory,
          amount: parseFloat(amount),
          description,
          recurrence: categoryType === "fixed" ? recurrence : null,
          date,
        };

        const response = await axiosInstance.put(
          `update-expense/${expenseToUpdate.id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setExpenses(expenses.map((expense) => (expense.id === expenseToUpdate.id ? response.data : expense)));
        setShowUpdateModal(false);
        setExpenseToUpdate(null);
        setNewExpense({ categoryType: "", subcategory: "", recurrence: "", description: "", amount: "", date: "" });
      } catch (error) {
        console.error("Error updating expense:", error);
      }
    } else {
      alert("Please fill all required fields.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axiosInstance.delete(`delete-expense/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };


  const handlePayExpense = async (expense) => {
    const newExpense = {
      category: expense.category,
      subcategory: expense.subcategory,
      amount: expense.amount,
      description: expense.description,
      recurrence: expense.recurrence,
      date: new Date().toISOString().split("T")[0], // set current date
    };

    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.post("add-expense/", newExpense, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses([...expenses, response.data]);
      setTotalExpenses((prev) => prev + response.data.amount); // Update total expense
    } catch (error) {
      console.error("Error paying expense:", error);
    }
  };

  const toggleHistoryModal = () => {
    setShowHistoryModal(!showHistoryModal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-200 text-gray-800 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white shadow-xl rounded-2xl p-6 cursor-pointer hover:bg-blue-50" onClick={handleBudgetChange}>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Budget</h4>
            {budget === null || isNaN(budget) ? (
              <p className="text-blue-600">Add Budget</p>
            ) : (
              <>
                <p className="text-xl font-bold text-blue-600">PKR {Number(budget).toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Click to update</p>
              </>
            )}
          </motion.div>

          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Total Expenses</h4>
            <p className="text-xl font-bold text-red-500">PKR {totalExpenses.toFixed(2)}</p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Remaining Budget</h4>
            <p className="text-xl font-bold text-green-500">PKR {remainingBudget.toFixed(2)}</p>
          </div>
        </div>

        {/* Graph Plot */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPreviousMonth} className="text-2xl font-bold text-gray-600 hover:text-black">&lt;</button>
            <h2 className="text-xl font-semibold">{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
            <button onClick={goToNextMonth} className="text-2xl font-bold text-gray-600 hover:text-black">&gt;</button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareGraphData()}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false} // Removes the dots on each point
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-semibold">Expenses</h3>
      <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">Add Expense</button>
      <button onClick={() => setShowHistoryModal(true)} className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition">Expense History</button>
    </div>
{/* //////////////////// */}
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <div>
        <h4 className="text-xl font-semibold mb-4">Fixed Expenses</h4>
          <div className="space-y-4">
            {expenses
              .filter((expense) => expense.category === "fixed")
              .map((expense) => (
              <div key={expense.id} className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{expense.subcategory} - {expense.description}</p>
                  <p className="text-sm text-gray-600">Amount: PKR {expense.amount}</p>
                </div>

                <button
                  onClick={() => handlePayExpense(expense)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Pay
                </button>
                {/* <div className="flex gap-2"> */}
                      <button onClick={() => openUpdateExpenseModal(expense)} className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Update</button>
                      <button onClick={() => deleteExpense(expense.id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    {/* </div> */}
              </div>
              ))}
          </div>
      </div>
    </div>

     {/* Expense History Popup */}
    
    {showHistoryModal && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
      ref={historyRef}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-auto max-h-[80vh] overflow-y-auto"
    >
      
      <div className="bg-white p-6 max-w-2xl  rounded-lg shadow-xl w-150">
        <h4 className="text-lg font-semibold mb-4">Expense History</h4>
        <div className="space-y-4">
          {expenses.map((expense) => (
          <div key={expense.id} className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-semibold">{expense.category}</p>
              <p className="font-semibold">{expense.subcategory}</p>
              <p className="text-sm text-gray-600">Amount: PKR {expense.amount}</p>
            </div>
          </div>
          ))}
        </div>
        <button onClick={toggleHistoryModal} className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition">Close</button>
      </div>
      </div>
    </div>
    )}
            


{/* //////////////////// */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Fixed Expenses</h4>
            <div className="space-y-4">
              {expenses
                .filter((expense) => expense.category === "fixed")
                .map((expense) => (
                  <div key={expense.id} className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{expense.subcategory} - {expense.description}</p>
                      <p className="text-sm text-gray-500">Amount: PKR {expense.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openUpdateExpenseModal(expense)} className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Update</button>
                      <button onClick={() => deleteExpense(expense.id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div> */}

          {/* Variable Expenses Column */}
          {/* <div>
            <h4 className="text-xl font-semibold mb-4">Variable Expenses</h4>
            <div className="space-y-4">
              {expenses
                .filter((expense) => expense.category === "variable")
                .map((expense) => (
                  <div key={expense.id} className="bg-white shadow rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{expense.subcategory} - {expense.description}</p>
                      <p className="text-sm text-gray-500">Amount: PKR {expense.amount}</p>
                      <p className="text-sm text-gray-500">Date: {expense.date}</p>

                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openUpdateExpenseModal(expense)} className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Update</button>
                      <button onClick={() => deleteExpense(expense.id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          </div> 
        </div>*/}


        {/* Modal for Adding/Updating Expense */}
        {(showModal || showUpdateModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">{showUpdateModal ? "Update Expense" : "Add New Expense"}</h3>
              <div className="space-y-3">
                <select value={newExpense.categoryType} onChange={(e) => setNewExpense({ ...newExpense, categoryType: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Select Category</option>
                  <option value="fixed">Fixed Expense</option>
                  <option value="variable">Variable Expense</option>
                </select>
                
                <select
                  value={newExpense.subcategory}
                  onChange={(e) => setNewExpense({ ...newExpense, subcategory: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Subcategory</option>
                  {newExpense.categoryType === "fixed" &&
                    Object.entries(fixedExpenses).map(([group, items]) => (
                      <optgroup key={group} label={group}>
                        {items.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </optgroup>
                    ))
                  }
                  {newExpense.categoryType === "variable" &&
                    Object.entries(variableExpenses).map(([group, items]) => (
                      <optgroup key={group} label={group}>
                        {items.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </optgroup>
                    ))
                  }
                </select>

                {newExpense.categoryType === "fixed" && (
                  <select value={newExpense.recurrence} onChange={(e) => setNewExpense({ ...newExpense, recurrence: e.target.value })} className="w-full p-2 border rounded">
                    <option value="">Select Recurrence</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="once">One-time</option>
                  </select>
                )}

                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full p-2 border rounded"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full p-2 border rounded"
                />

                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              

              <div className="flex justify-between mt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded-lg">Cancel</button>
                <button onClick={showUpdateModal ? updateExpense : submitExpense} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{showUpdateModal ? "Update" : "Submit"}</button>
              </div>
            </div>
          </div>
        )}

        {showBudgetModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h3 className="text-xl font-bold mb-4">Set Monthly Budget</h3>
      <input
        type="number"
        placeholder="Enter budget amount"
        className="w-full p-2 border rounded mb-4"
        value={newExpense.amount}
        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowBudgetModal(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleBudgetSubmit();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
      </div>
      
    </div>
    
  );
};

export default ExpenseTracking;
