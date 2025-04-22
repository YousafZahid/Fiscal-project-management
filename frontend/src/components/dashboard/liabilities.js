import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Progress,
  Modal,
  Input,
  Button,
  DatePicker,
  message,
  Table,
  Select,
} from "antd";
import Navbar from "./navbar";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const Liabilities = () => {
  const [liabilities, setLiabilities] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [liabilityType, setLiabilityType] = useState("");
  const [formData, setFormData] = useState({ remaining_balance: 0 });
  const [selectedLiability, setSelectedLiability] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  
  useEffect(() => {
    fetchLiabilities();
  }, []);

  const fetchLiabilities = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.get("/liabilities/", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { loans, credit_card_debts, mortgages } = response.data;
      const combined = [...loans, ...credit_card_debts, ...mortgages];
      setLiabilities(combined);
    } catch (error) {
      console.error("Failed to fetch liabilities:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, dateString, field) => {
    setFormData((prev) => ({ ...prev, [field]: dateString }));
  };
  // const handleAddLiability = async () => {
  //   try {
  //     const token = localStorage.getItem("access_token");
  
  //     let endpoint = "";
  //     if (liabilityType === "loan") endpoint = "/loans/";
  //     else if (liabilityType === "credit_card") endpoint = "/credit-cards/";
  //     else if (liabilityType === "mortgage") endpoint = "/mortgages/";
  //     console.log(liabilityType, formData);
  //     const dataToSend = {
  //       ...formData,
  //       remaining_balance: formData.remaining_balance || formData.,  // default to 0 if not set
  //     };
  
  //     await axiosInstance.post(endpoint, dataToSend, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     message.success("Liability added successfully!");
  //     setAddModalVisible(false);
  //     setLiabilityType("");
  //     setFormData({ remaining_balance: 0 });
  //     fetchLiabilities();
  //   } catch (error) {
  //     console.error("Error adding liability:", error);
  //     message.error("Failed to add liability");
  //   }
  // };

  const handleSubmitLiability = async () => {
    try {
      const token = localStorage.getItem("access_token");
  
      let endpoint = "";
      if (liabilityType === "loan") endpoint = "/loans/";
      else if (liabilityType === "credit_card") endpoint = "/credit-cards/";
      else if (liabilityType === "mortgage") endpoint = "/mortgages/";
  
      const dataToSend = {
        ...formData,
        remaining_balance: formData.remaining_balance || 0,
      };
      console.log(formData, selectedLiability);
  
      if (isEditing && selectedLiability?.id) {
        await axiosInstance.put(`${endpoint}${selectedLiability.id}/`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Liability updated successfully!");
      } else {
        await axiosInstance.post(endpoint, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("Liability added successfully!");
      }
  
      setAddModalVisible(false);
      setLiabilityType("");
      setFormData({ remaining_balance: 0 });
      setIsEditing(false);
      setSelectedLiability(null);
      fetchLiabilities();
    } catch (error) {
      console.error("Error saving liability:", error);
      message.error("Failed to save liability");
    }
  };
  
  const handleDeleteLiability = async (liability) => {
    try {
      const token = localStorage.getItem("access_token");
      let endpoint = "";
      if (liability.loan_amount !== undefined) endpoint = `/loans/${liability.id}/`;
      else if (liability.credit_card_balance !== undefined) endpoint = `/credit-cards/${liability.id}/`;
      else if (liability.mortgage_amount !== undefined) endpoint = `/mortgages/${liability.id}/`;
      
      await axiosInstance.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      message.success(`${liability.description}` + " deleted successfully!");
      setViewModalVisible(false);
      fetchLiabilities();
    } catch (error) {
      console.error("Error deleting liability:", error);
      message.error("Failed to delete liability");
    }
  };

  const identifyLiabilityType = (liability) => {
  if ("loan_amount" in liability) return "loan";
  if ("credit_card_balance" in liability) return "credit_card";
  if ("mortgage_amount" in liability) return "mortgage";
  return "";
};

  const renderTypeForm = () => {
    return (
      <>
        <DatePicker
          style={{ width: "100%", marginBottom: 10 }}
          name="start_date"
          value={formData.start_date ? dayjs(formData.start_date) : null}
          onChange={(date, dateString) =>
            handleDateChange(date, dateString, "start_date")
          }
          placeholder="Start Date"
        />
        <DatePicker
          style={{ width: "100%", marginBottom: 10 }}
          name="due_date"
          value={formData.due_date ? dayjs(formData.due_date) : null}
          onChange={(date, dateString) =>
            handleDateChange(date, dateString, "due_date")
          }
          placeholder="Due Date"
        />
        <TextArea
          rows={3}
          placeholder="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          style={{ marginBottom: 10 }}
        />
        <Input
          name="remaining_balance"
          placeholder="Remaining Balance"
          type="number"
          value={formData.remaining_balance}
          onChange={handleInputChange}
          style={{ marginBottom: 10 }}
        />
        {liabilityType === "loan" && (
          <>
            <Input
              name="loan_amount"
              placeholder="Loan Amount"
              value={formData.loan_amount || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="interest_rate"
              placeholder="Interest Rate (%)"
              
              value={formData.interest_rate || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="loan_term"
              placeholder="Loan Term (e.g., 5 years)"
              value={formData.loan_term || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="monthly_payment"
              placeholder="Monthly Payment"
              value={formData.monthly_payment || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
          </>
        )}

        {liabilityType === "credit_card" && (
          <>
            <Input
              name="credit_card_balance"
              placeholder="Credit Card Balance"
              value={formData.credit_card_balance || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="credit_card_apr"
              placeholder="APR (%)"
              value={formData.credit_card_apr || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="minimum_payment"
              placeholder="Minimum Payment"
              value={formData.minimum_payment || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="credit_limit"
              placeholder="Credit Limit"
              value={formData.credit_limit || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="revolving_balance"
              placeholder="Revolving Balance"
              value={formData.revolving_balance || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
          </>
        )}

        {liabilityType === "mortgage" && (
          <>
            <Input
              name="mortgage_amount"
              placeholder="Mortgage Amount"
              value={formData.mortgage_amount || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="mortgage_interest_rate"
              placeholder="Interest Rate (%)"
              value={formData.mortgage_interest_rate || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="mortgage_term_length"
              placeholder="Term Length (e.g., 30 years)"
              value={formData.mortgage_term_length || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
            <Input
              name="mortgage_monthly_payment"
              placeholder="Monthly Payment"
              value={formData.mortgage_monthly_payment || ""}
              onChange={handleInputChange}
              style={{ marginBottom: 10 }}
            />
          </>
        )}
      </>
    );
  };
  
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
    },
    {
      title: "Remaining Balance",
      dataIndex: "remaining_balance",
      key: "remaining_balance",
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => (
        <div style={{ width: 200 }}>
          <Progress
            percent={record.progress || 0}
            status="active"
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <Navbar />
      <div style={{ padding: "24px" }}>
        <h1>
          <DollarOutlined /> Liabilities
        </h1>

        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {setAddModalVisible(true);setIsEditing(false);}}
        >
          Add New Liability
        </Button>

        <Table
          dataSource={liabilities}
          columns={columns}
          rowKey="id"
          style={{ marginTop: 20 }}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedLiability(record);
                setViewModalVisible(true);
              },
            };
          }}
          />

        <Modal
          title={
            !liabilityType
              ? "Select Liability Type"
              : `Add ${liabilityType.replace("_", " ").toUpperCase()}`
          }
          open={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false);
            setLiabilityType("");
            setFormData({ remaining_balance: 0 });
          }}
          onOk={liabilityType ? handleSubmitLiability : null}
          okText={liabilityType ? "Add" : null}
          cancelText="Cancel"
          footer={
            !liabilityType ? null : [
              <Button
                key="cancel"
                onClick={() => {
                  setAddModalVisible(false);
                  setLiabilityType("");
                  setFormData({ remaining_balance: 0 });
                }}
              >
                Cancel
              </Button>,
              
              <Button key="submit" type="primary" onClick={handleSubmitLiability} >
                {isEditing ? "Update" : "Add"}
                
              </Button>,
            ]
          }
        >
          {!liabilityType ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Button onClick={() => setLiabilityType("loan")}>Loan</Button>
              <Button onClick={() => setLiabilityType("credit_card")}>
                Credit Card Debt
              </Button>
              <Button onClick={() => setLiabilityType("mortgage")}>
                Mortgage
              </Button>
            </div>
          ) : (
            renderTypeForm()
          )}
        </Modal>

        <Modal
  title="Liability Details"
  open={viewModalVisible}
  onCancel={() => setViewModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setViewModalVisible(false)}>
      Close
    </Button>,
    <Button
      key="edit"
      type="primary"
      icon={<EditOutlined />}
      onClick={() => {
        setLiabilityType(identifyLiabilityType(selectedLiability));
        setFormData(selectedLiability);
        setIsEditing(true);
        setAddModalVisible(true);
        setViewModalVisible(false);
      }}
    >
      Edit
    </Button>,
    <Button
      key="delete"
      type="primary"
      danger
      icon={<DeleteOutlined />}
      onClick={() => handleDeleteLiability(selectedLiability)}
    >
      Delete
    </Button>,
  ]}
>
  {selectedLiability && (
    <div style={{ lineHeight: 2 }}>
      {Object.entries(selectedLiability).map(([key, value]) => (
        <div key={key}>
          <strong>{key.replace(/_/g, " ")}:</strong> {value}
        </div>
      ))}
    </div>
  )}
</Modal>

      </div>
    </div>
  );
};

export default Liabilities;