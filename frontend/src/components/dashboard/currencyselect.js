import React from 'react';

const CurrencySelect = ({ name, value, onChange }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{
        padding: '8px',
        borderRadius: '4px',
        width: '101.5%',  // Ensure it matches the input field width
        border: '1px solid #ccc', // Same border style as inputs
        display: 'block', // Ensure it's block-level to align with inputs
        marginBottom: '10px', // Same spacing as inputs
        
      }}

    >
      <option value="">Select Currency (Default Currency is PKR)</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
      <option value="INR">INR</option>
      <option value="JPY">JPY</option>
      {/* Add other currency options here */}
    </select>
  );
};

export default CurrencySelect;
