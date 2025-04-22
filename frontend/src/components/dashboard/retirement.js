import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "./navbar";
import { Modal, Input, Button, Form, Select, Checkbox, Divider } from "antd";

const { Option } = Select;

const CreateRetirementPlan = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  const [retirementData, setRetirementData] = useState({
    currentAge: "",
    retirementAge: "",
    lifeExpectancy: "",
    incomeFrequency: "monthly", // default
    incomeAmount: "",
  });

  // Fetch user assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axiosInstance.get("assets/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const assetsData = res.data.map(asset => ({ ...asset, included: true }));
        setAssets(assetsData);
        console.log(assetsData);
        setSelectedAssets(assetsData.map(asset => asset.id));
        const initialTotal = assetsData.reduce((sum, a) => sum + parseFloat(a.amount || 0), 0);
        setTotalSavings(initialTotal);
      } catch (err) {
        console.error("Error fetching assets:", err);
      }
    };

    if (isModalVisible) {
      fetchAssets();
    }
  }, [isModalVisible]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRetirementData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setRetirementData((prev) => ({ ...prev, incomeFrequency: value }));
  };

  const handleAssetToggle = (assetId) => {
    const updatedAssets = assets.map((asset) =>
      asset.id === assetId ? { ...asset, included: !asset.included } : asset
    );
    setAssets(updatedAssets);

    const includedAssets = updatedAssets.filter((a) => a.included);
    setSelectedAssets(includedAssets.map((a) => a.id));
    const newTotal = includedAssets.reduce((sum, a) => sum + parseFloat(a.amount || 0), 0);
    setTotalSavings(newTotal);
  };
  const handleCreatePlan = async () => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      incomeFrequency,
      incomeAmount,
    } = retirementData;
  
    if (!currentAge || !retirementAge || !incomeAmount) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const token = localStorage.getItem("access_token");
  
      const payload = {
        current_age: parseInt(currentAge),
        retirement_age: parseInt(retirementAge),
        life_expectancy: lifeExpectancy ? parseInt(lifeExpectancy) : undefined,
        desired_income: parseFloat(incomeAmount).toFixed(2),
        is_annual_income: incomeFrequency === "annual",
        current_savings: parseFloat(totalSavings).toFixed(2),
        included_assets: selectedAssets,
      };
  
      const res = await axiosInstance.post(
        "retirement-plan/",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Retirement plan created!");
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error creating plan:", err.response?.data || err.message);
      alert("Failed to create retirement plan.");
    }
  };
  
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Create Retirement Plan
        </Button>

        <Modal
          title="Retirement Plan Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
            <Button key="submit" type="primary" onClick={handleCreatePlan}>Create Plan</Button>
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="Current Age">
              <Input
                type="number"
                name="currentAge"
                value={retirementData.currentAge}
                onChange={handleInputChange}
                placeholder="e.g., 30"
              />
            </Form.Item>

            <Form.Item label="Retirement Age">
              <Input
                type="number"
                name="retirementAge"
                value={retirementData.retirementAge}
                onChange={handleInputChange}
                placeholder="e.g., 60"
              />
            </Form.Item>

            <Form.Item label="Life Expectancy">
              <Input
                type="number"
                name="lifeExpectancy"
                value={retirementData.lifeExpectancy}
                onChange={handleInputChange}
                placeholder="e.g., 85"
              />
            </Form.Item>

            <Form.Item label="Income Type">
              <Select value={retirementData.incomeFrequency} onChange={handleSelectChange}>
                <Option value="monthly">Monthly</Option>
                <Option value="annual">Annual</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Income Amount">
              <Input
                type="number"
                name="incomeAmount"
                value={retirementData.incomeAmount}
                onChange={handleInputChange}
                placeholder="Enter your income amount"
              />
            </Form.Item>

            <Divider>Assets</Divider>
            {assets.map((asset) => (
              <div key={asset.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Checkbox checked={asset.included} onChange={() => handleAssetToggle(asset.id)}>
                  {asset.name}
                </Checkbox>
                <span>${parseFloat(asset.amount).toLocaleString()}</span>
              </div>
            ))}

            <Divider />
            <p><strong>Total Current Savings:</strong> ${totalSavings.toLocaleString()}</p>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CreateRetirementPlan;
