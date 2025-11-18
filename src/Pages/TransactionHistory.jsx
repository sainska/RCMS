
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionHistory.css";
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaDownload, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/api/transactions");
        setTransactions(res.data);
      } catch {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);


  const handleDownload = (txn) => {
    const data = `\n      Project: ${txn.project}\n      Amount: Ksh ${txn.amount}\n      Date: ${new Date(txn.date).toLocaleDateString()}\n      Status: ${txn.status}\n    `;
    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${txn.project.replace(/\s+/g, '_')}_Transaction.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendToUser = (txn) => {
    alert(`Transaction details for "${txn.project}" sent to the user successfully!`);
  };

  if (loading) return <div className="transaction-history-container"><p>Loading transactions...</p></div>;
  if (error) return <div className="transaction-history-container"><p>{error}</p></div>;

  return (
    <div className="transaction-history-container">
      <header className="module-header">
        <div className="module-logo">RCMS</div>
        <div className="module-back" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="module-title">Transaction History</h2>

      <div className="transactions-list">
        {transactions.map((txn) => (
          <div className="transaction-card" key={txn._id}>
            <FaMoneyBillWave className="txn-icon" />
            <div className="txn-details">
              <h4>{txn.project}</h4>
              <p><strong>Amount:</strong> Ksh {txn.amount}</p>
              <p><strong>Date:</strong> {new Date(txn.date).toLocaleDateString()}</p>
              <p className={`txn-status ${txn.status.toLowerCase()}`}>
                {txn.status === "Success" && <FaCheckCircle />}
                {txn.status === "Failed" && <FaTimesCircle />}
                {txn.status}
              </p>
              <div className="txn-actions">
                <button className="action-btn download-btn" onClick={() => handleDownload(txn)}>
                  <FaDownload /> Download
                </button>
                <button className="action-btn send-btn" onClick={() => handleSendToUser(txn)}>
                  <FaPaperPlane /> Send to User
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
