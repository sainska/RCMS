import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from '../AppContext';
import { paymentAPI, projectAPI, milestoneAPI, handleApiError, apiFetch } from '../utils/api';
import StateMessage from "../components/feedback/StateMessage";
import "./MakePayments.css";

const MakePayments = () => {
  const navigate = useNavigate();
  const { selectedProject } = useAppContext();
  
  // Form state
  const [formData, setFormData] = useState({
    projectId: "",
    milestoneId: "",
    amount: "",
    phoneNumber: "",
    method: "M-Pesa",
    accountReference: "",
    description: ""
  });
  
  // Data state
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const pollTimeoutRef = useRef(null);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
    loadPaymentHistory();
  }, []);

  // Load milestones when project changes
  useEffect(() => {
    if (formData.projectId) {
      loadMilestones(formData.projectId);
    }
  }, [formData.projectId]);

  // Pre-select project if coming from context
  useEffect(() => {
    if (selectedProject && selectedProject.id) {
      setFormData(prev => ({
        ...prev,
        projectId: selectedProject.id,
        accountReference: selectedProject.projectName || `Project ${selectedProject.id}`
      }));
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      const projectsData = await projectAPI.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadMilestones = async (projectId) => {
    try {
      setMilestonesLoading(true);
      const milestonesData = await milestoneAPI.getByProject(projectId);
      setMilestones(milestonesData.stages || []);
    } catch (error) {
      console.error('Failed to load milestones:', error);
      setMilestones([]);
    } finally {
      setMilestonesLoading(false);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      setHistoryLoading(true);
      const history = await paymentAPI.getHistory();
      setPaymentHistory(history);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.projectId) {
      setError("Please select a project");
      return false;
    }
    
    if (!formData.milestoneId) {
      setError("Please select a milestone");
      return false;
    }
    
    if (!formData.amount || formData.amount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    
    if (formData.method === "M-Pesa") {
      if (!formData.phoneNumber) {
        setError("Please enter a phone number");
        return false;
      }
      
      // Validate Kenyan phone number
      const phoneRegex = /^(254|07)\d{8,9}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        setError("Please enter a valid Kenyan phone number (254XXXXXXXXX or 07XXXXXXXX)");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    setPaymentStatus(null);

    try {
      let paymentResponse;
      
      if (formData.method === "M-Pesa") {
        // Initiate M-Pesa STK Push
        setProcessing(true);
        paymentResponse = await paymentAPI.initiateMpesa({
          phoneNumber: formData.phoneNumber,
          amount: parseFloat(formData.amount),
          accountReference: formData.accountReference || `RCMS-${formData.projectId}`,
          description: formData.description || `Payment for milestone ${formData.milestoneId}`
        });
        
        setSuccess("✅ M-Pesa STK Push initiated! Please check your phone to complete the payment.");
        setPaymentStatus({
          type: 'mpesa',
          transactionId: paymentResponse.transactionId,
          status: 'pending',
          instructions: paymentResponse.instructions
        });
        
        // Start polling for payment status
        pollPaymentStatus(paymentResponse.transactionId);
      } else {
        // Handle other payment methods
        paymentResponse = await paymentAPI.create({
          ...formData,
          amount: parseFloat(formData.amount),
          status: 'pending'
        });
        
        setSuccess("✅ Payment request submitted successfully!");
      }
      
      // Reload payment history
      loadPaymentHistory();
      
    } catch (error) {
      console.error('Payment error:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (transactionId) => {
    const maxAttempts = 20;
    let attempts = 0;

    const poll = async () => {
      try {
        const statusData = await apiFetch(`/api/payments/mpesa/status/${transactionId}`);

        if (statusData.status === 'completed') {
          setSuccess("✅ Payment completed successfully!");
          setProcessing(false);
          setPaymentStatus((prev) => ({
            ...prev,
            status: 'completed',
            completedAt: statusData.completedAt
          }));
          loadPaymentHistory();
          return;
        }

        if (statusData.status === 'failed') {
          setError(`❌ Payment failed: ${statusData.failureReason}`);
          setProcessing(false);
          setPaymentStatus((prev) => ({
            ...prev,
            status: 'failed'
          }));
          return;
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        pollTimeoutRef.current = setTimeout(poll, 30000);
      } else {
        setProcessing(false);
        setError("⏰ Payment status check timed out. Please check your payment history.");
      }
    };

    pollTimeoutRef.current = setTimeout(poll, 30000);
  };

  useEffect(() => () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
    }
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-KE');
  };

  return (
    <div className="make-payments-container">
      <header className="payments-header">
        <div className="logo">RCMS</div>
        <h1>Make Payments</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </header>

      <div className="payments-content">
        {/* Payment Form */}
        <div className="payment-form-section">
          <h2>Initiate Payment</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Select Project *</label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                required
                disabled={loading || projectsLoading}
              >
                <option value="">Choose a project</option>
                {projects.map(project => (
                  <option key={project.id || project._id} value={project.id || project._id}>
                    {project.projectName || project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Milestone *</label>
              <select
                name="milestoneId"
                value={formData.milestoneId}
                onChange={handleInputChange}
                required
                disabled={loading || !formData.projectId || milestonesLoading}
              >
                <option value="">Choose a milestone</option>
                {milestones.map(milestone => (
                  <option key={milestone.id || milestone._id} value={milestone.id || milestone._id}>
                    {milestone.title || milestone.name} - {formatCurrency(milestone.estimatedCost || milestone.amount)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (KES) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="1"
                max="150000"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Payment Method *</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {formData.method === "M-Pesa" && (
              <div className="form-group">
                <label>M-Pesa Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="254XXXXXXXXX or 07XXXXXXXX"
                  pattern="^(254|07)\d{8,9}$"
                  required
                  disabled={loading}
                />
                <small>Enter a valid Kenyan phone number</small>
              </div>
            )}

            <div className="form-group">
              <label>Account Reference</label>
              <input
                type="text"
                name="accountReference"
                value={formData.accountReference}
                onChange={handleInputChange}
                placeholder="Account reference (optional)"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Payment description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="submit-payment-btn"
              disabled={loading || processing}
            >
              {loading ? "Processing..." : `Pay with ${formData.method}`}
            </button>
          </form>

          {/* Payment Status */}
          {paymentStatus && (
          <div className="payment-status">
              <h3>Payment Status</h3>
              <div className={`status-indicator ${paymentStatus.status}`}>
                <strong>Transaction ID:</strong> {paymentStatus.transactionId}<br/>
                <strong>Status:</strong> {paymentStatus.status}<br/>
                {paymentStatus.completedAt && (
                  <><strong>Completed:</strong> {formatDate(paymentStatus.completedAt)}</>
                )}
              </div>
              
              {paymentStatus.instructions && (
                <div className="payment-instructions">
                  <h4>Instructions:</h4>
                  <ol>
                    <li>{paymentStatus.instructions.step1}</li>
                    <li>{paymentStatus.instructions.step2}</li>
                    <li>{paymentStatus.instructions.step3}</li>
                  </ol>
                  <p><em>{paymentStatus.instructions.note}</em></p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="payment-history-section">
          <div className="payments-header">
            <h2>Recent Payments</h2>
            <button type="button" className="refresh-btn" onClick={loadPaymentHistory} disabled={historyLoading}>
              {historyLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="payments-list">
            {historyLoading ? (
              <StateMessage type="info" title="Loading payments" description="Pulling the latest transactions..." />
            ) : paymentHistory.length === 0 ? (
              <StateMessage type="empty" title="No payment history" description="Your recent payments will appear here once available." />
            ) : (
              paymentHistory.slice(0, 10).map(payment => (
                <div key={payment.id || payment._id} className="payment-item">
                  <div className="payment-info">
                    <strong>{payment.transactionId}</strong>
                    <span className={`status ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="payment-details">
                    <div>Amount: {formatCurrency(payment.amount)}</div>
                    <div>Method: {payment.method}</div>
                    <div>Date: {formatDate(payment.createdAt)}</div>
                    {payment.completedAt && (
                      <div>Completed: {formatDate(payment.completedAt)}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayments;
