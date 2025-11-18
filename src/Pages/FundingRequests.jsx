
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FundingRequests.css";
import { FaMoneyCheckAlt, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const FundingRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/funding-requests");
        setRequests(res.data);
      } catch {
        setError("Failed to load funding requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`/api/funding-requests/${id}`, { status: "Approved" });
      setRequests((prev) => prev.map((req) => req._id === id ? res.data : req));
    } catch {
      alert("Failed to approve funding request");
    }
  };

  if (loading) return <div className="funding-requests-container"><p>Loading funding requests...</p></div>;
  if (error) return <div className="funding-requests-container"><p>{error}</p></div>;

  return (
    <div className="funding-requests-container">
      <header className="module-header">
        <div className="module-logo">RCMS</div>
        <div className="module-back" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="module-title">Funding Requests</h2>

      <div className="requests-grid">
        {requests.map((req) => (
          <div className="request-card" key={req._id}>
            <FaMoneyCheckAlt className="request-icon" />
            <h3>{req.project}</h3>
            <p><strong>Amount:</strong> Ksh {req.amount}</p>
            <p><strong>Reason:</strong> {req.reason}</p>
            <p className={`status ${req.status.toLowerCase()}`}>Status: {req.status}</p>
            {req.status === "Pending" && (
              <button onClick={() => handleApprove(req._id)} className="approve-btn">
                <FaCheckCircle /> Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundingRequests;
