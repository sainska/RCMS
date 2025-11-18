
import React, { useState, useEffect } from "react";
import "./ViewInvoices.css";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("/api/invoices");
        setInvoices(res.data);
      } catch {
        setError("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);


  const handleDownload = (id) => {
    alert(`Invoice ${id} downloaded!`);
  };

  if (loading) return <div className="view-invoices-container"><p>Loading invoices...</p></div>;
  if (error) return <div className="view-invoices-container"><p>{error}</p></div>;

  return (
    <div className="view-invoices-container">
      {/* Standard Header */}
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="invoices-title">View Invoices</h2>

      <div className="invoice-grid">
        {invoices.map((inv) => (
          <div key={inv._id} className="invoice-card">
            <div className="invoice-id">{inv._id}</div>
            <div className="invoice-info">
              <p><strong>Project:</strong> {inv.project}</p>
              <p><strong>Amount:</strong> KES {inv.amount}</p>
              <p><strong>Date:</strong> {new Date(inv.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong>
                <span className={`status ${inv.status.toLowerCase()}`}>{inv.status}</span>
              </p>
              <p><strong>Approved:</strong>
                <span className={`approval ${inv.approved ? "yes" : "no"}`}>
                  {inv.approved ? "✔ Approved" : "✖ Not Approved"}
                </span>
              </p>
            </div>
            <button className="download-btn" onClick={() => handleDownload(inv._id)}>
              <FaFilePdf /> Download Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewInvoices;
