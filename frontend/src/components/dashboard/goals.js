import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Progress, Modal, Input, Button, DatePicker, message, Table } from "antd";
import Navbar from "./navbar";
import {EditOutlined, DeleteOutlined, PlusCircleOutlined, DollarOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [ongoingGoals, setOngoingGoals] = useState([]);
  const [pendingGoals, setPendingGoals] = useState([]);
  const [savingAmount, setSavingAmount] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [savingModalVisible, setSavingModalVisible] = useState(false);
  const [goalDetailModalVisible, setGoalDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.get("goals/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGoals(response.data);

      const now = dayjs();
      const achieved = response.data.filter((goal) => goal.progress >= 100);
      const ongoing = response.data.filter((goal) => goal.progress > 0 && goal.progress < 100);
      const pending = response.data.filter((goal) => goal.progress == 0);
      if(achieved != null){
        setAchievedGoals(achieved);
      }
      if(pending != null){
        setPendingGoals(pending);
      }
      if(ongoing != null){
        setOngoingGoals(ongoing);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleDateChange = (date, dateString) => {
    setDueDate(dateString);
  };

  const handleSaveGoal = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const goalData = {
        name: goalName,
        target_amount: targetAmount,
        due_date: dueDate,
      };
      if(editingGoal){
        await axiosInstance.put(`goals/${editingGoal.id}/`, goalData, {
            headers: {Authorization: `Bearer ${token}`},
        });
        message.success("Goal updated successfully!");
      }  else {
        await axiosInstance.post("goals/", goalData, {
            headers: {Authorization: `Bearer ${token}`},
        });
        message.success("Goal added Successfully!");
      }
      fetchGoals();
      setIsModalVisible(false);
      setEditingGoal(null);
      resetForm();
    } catch (error) {
      console.error("Error saving goal:", error);
      message.error("Failed to save money");
    }
  };

  const handleRowClick = (goal) => {
    setSelectedGoal(goal);
    setGoalDetailModalVisible(true);
  }

  const goalStatus = (goal) => {
    if(goal.progress === 0) return "Pending";
    if(goal.progress > 0 && goal.progress < 100) return "Ongoing";
    return "completed";
  }

  const nextTransaction = (goal) => {
    const remainingAmount = goal.target_amount - goal.saved_amount;
    const daysRemaining = dayjs(goal.due_date).diff(dayjs(), "day");
    const weekRemaining = daysRemaining/7;
    console.log(weekRemaining);

    return daysRemaining > 0 ? `PKR ${(remainingAmount / daysRemaining).toFixed(2)}/day` : `PKR ${remainingAmount} ASAP`;
  }

  const openSaveMoneyModal = (goal) => {
    setSelectedGoal(goal);
    setSavingModalVisible(true);
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setTargetAmount(goal.target_amount);
    setDueDate(goal.due_date);
    setIsModalVisible(true);
  }

  const handleDeleteGoal = async (goalId) => {
    try {
        const token = localStorage.getItem("access_token");
        await axiosInstance.delete(`goals/${goalId}/`, {
            headers: {Authorization: `bearer${token}`},
        });
        message.success("Goal Deleted Successfully!");
        fetchGoals();
    }
    catch (error) {
        console.error("Error Deleting goal:", error);
        message.error("Failed to delete goal.");
    }
  };

  const handleSaveMoney = async () => {
    try{
        if(!savingAmount || isNaN(savingAmount) || savingAmount <= 0){
            message.error("Please enter a valid amount.");
            return;
        }

        const token = localStorage.getItem("access_token");
        console.log(selectedGoal.id, selectedGoal.goalName);
        await axiosInstance.put(
            `goals/${selectedGoal.id}/`, 
            {saved_amount: savingAmount },
            
            {headers: {Authorization: `Bearer ${token}`}}
        );

        message.success("Savings updated Successfully!");
        fetchGoals();
        setSavingModalVisible(false);
        setSavingAmount("")
    } catch (error) {
        console.log("Error saving money", error);
        message.error("Failed to save money.");
    }
  }

  const resetForm = () => {
    setGoalName("");
    setTargetAmount("");
    setDueDate("");
  };

  const columns = [
    {
      title: "Goal Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Target Amount (PKR)",
      dataIndex: "target_amount",
      key: "target_amount",
      render: (text) => `PKR ${text}`,
    },
    // {
    //   title: "Saved Amount (PKR)",
    //   dataIndex: "saved_amount",
    //   key: "saved_amount",
    //   render: (text) => `PKR ${text}`,
    // },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => <Progress percent={record.progress} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
    {/* //         <Button
    //         icon={<EditOutlined />}
    //         onClick={() => handleEditGoal(record)}
    //         style={{ background: "#1890ff", color: "#fff", border: "none" }}
    //       />
    //       <Button
    //         icon={<DeleteOutlined />}
    //         onClick={() => handleDeleteGoal(record.id)}
    //         style={{ background: "#ff4d4f", color: "#fff", border: "none" }}
    //       /> */}
          <Button
            icon={<DollarOutlined />} 
            onClick={() => openSaveMoneyModal(record)} 
            type="primary">
                Save Money
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Navbar />
      <h2 style={styles.title}> Your Goals</h2>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={styles.addButton}
        onClick={() => {
          setIsModalVisible(true);
          setEditingGoal(null);
          setGoalName("");
          setTargetAmount("");
          setDueDate("");
        //   resetForm();
        }}
      >
        Add New Goal
      </Button>

      
        {achievedGoals.length > 0 && (
            <>
            <h3 style={styles.sectionTitle}>Achieved Goals</h3>
            <Table columns={columns} dataSource={achievedGoals} rowKey="id" pagination={false} onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: {cursor: "pointer"},
            })}/>
            </>
        )}
      
    
    {ongoingGoals.length > 0 && (
    <>
      <h3 style={styles.sectionTitle}>Ongoing Goals</h3>
      <Table columns={columns} dataSource={ongoingGoals} rowKey="id" pagination={false} onRow={(record) => ({
        onClick: () => handleRowClick(record),
        style: {cursor: "pointer"},
      })}/>
    </>
    )}

    {pendingGoals.length > 0 && (
        <>
      <h3 style={styles.sectionTitle}>Pending Goals</h3>
      <Table columns={columns} dataSource={pendingGoals} rowKey="id" pagination={false} onRow={(record) => ({
        onClick: () => handleRowClick(record),
        style: {cursor: "pointer"},
      })}/>
      </>
    )}
      <Modal
        title="Goal Details"
        open={goalDetailModalVisible}
        onCancel={() => setGoalDetailModalVisible(false)}
        footer={null}
        >
            {selectedGoal && (
          <>
            <p><strong>Goal Name:</strong> {selectedGoal.name}</p>
            <p><strong>Total Goal Amount:</strong> PKR {selectedGoal.target_amount}</p>
            <p><strong>Saved Amount:</strong> PKR {selectedGoal.saved_amount || 0}</p>
            <p><strong>Due Date:</strong> {dayjs(selectedGoal.due_date).format("YYYY-MM-DD")}</p>
            <p><strong>Next Transaction to Save:</strong> {nextTransaction(selectedGoal)}</p>
            <p><strong>Status:</strong> {goalStatus(selectedGoal)}</p>
          </>
        )}
      </Modal>
      {/* Modal for Adding/Editing Goals */}
      <Modal
        title={editingGoal ? "Edit Goal" : "Set New Goal"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveGoal}
        okText={editingGoal ? "Update Goal" : "Save Goal"}
      >
        <Input placeholder="Goal Name" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
        <Input placeholder="Target Amount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} style={{ marginTop: "10px" }} />
        <DatePicker
          placeholder="Target Date"
          onChange={handleDateChange}
          value={dueDate ? dayjs(dueDate) : null}
          format="YYYY-MM-DD"
          style={{ width: "100%", marginTop: "10px" }}
        />
      </Modal>

      <Modal title="Save Money for Your Goal" open={savingModalVisible} onCancel={() => setSavingModalVisible(false)} onOk={handleSaveMoney}>
        <p>Saving for: <strong>{selectedGoal?.name}</strong></p>
        <p>Target Amount: <strong>PKR {selectedGoal?.target_amount}</strong></p>
        <Input type="number" placeholder="Enter amount to save" value={savingAmount} onChange={(e) => setSavingAmount(e.target.value)} />
      </Modal>
    
    </div>
  );
};

// 🎨 **Styling**
const styles = {
  container: {
    padding: "30px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  sectionTitle: {
    marginTop: "30px",
    fontSize: "22px",
    fontWeight: "bold",
    border: "2px solid black",
    padding: "10px",
    
  },
  addButton: {
    marginBottom: "20px",
  },
};

export default Goals;


//provide checks for goal completion
//on goal click only show the details and on save money click show the input popup for the amount
//add update and delete option in goals
