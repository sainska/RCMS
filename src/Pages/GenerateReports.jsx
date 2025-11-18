import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, API_BASE } from "../utils/api";
import "./GenerateReports.css";

const GenerateReports = () => {
  const navigate = useNavigate();
  const [reportTypes, setReportTypes] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [format, setFormat] = useState("pdf");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReportTypes();
  }, []);

  const loadReportTypes = async () => {
    try {
      const response = await apiFetch('/api/reports/types');
      const types = Array.isArray(response?.data) ? response.data : response;
      setReportTypes(types || []);
    } catch (error) {
      console.error('Failed to load report types:', error);
      setError('Failed to load report types');
    }
  };

  const handleReportChange = (reportId) => {
    setSelectedReport(reportId);
    setFilters({});
    setError("");
    setSuccess("");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const validateFilters = () => {
    if (!selectedReport) {
      setError("Please select a report type");
      return false;
    }

    const report = reportTypes.find(r => r.id === selectedReport);
    if (!report) return false;

    // Validate date range if selected
    if (filters.dateFrom && filters.dateTo) {
      if (new Date(filters.dateFrom) > new Date(filters.dateTo)) {
        setError("Start date cannot be after end date");
        return false;
      }
    }

    return true;
  };

  const generateReport = async (e) => {
    e.preventDefault();
    
    if (!validateFilters()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const reportData = {
        format,
        filters
      };

      const response = await fetch(`${API_BASE}/api/reports/${selectedReport}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rcms_token')}`
        },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        // Get filename from response headers or create one
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `RCMS_Report_${selectedReport}.${format}`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        // Download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setSuccess(`✅ Report generated and downloaded successfully!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      setError(`❌ Failed to generate report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderFilters = () => {
    const report = reportTypes.find(r => r.id === selectedReport);
    if (!report) return null;

    return (
      <div className="filters-section">
        <h3>Report Filters</h3>
        <div className="filters-grid">
          {report.filters.includes('status') && (
            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status || ""}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          )}

          {report.filters.includes('role') && (
            <div className="filter-group">
              <label>User Role</label>
              <select
                value={filters.role || ""}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="User">User</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Construction Company">Construction Company</option>
                <option value="Bank Management">Bank Management</option>
              </select>
            </div>
          )}

          {report.filters.includes('type') && (
            <div className="filter-group">
              <label>Transaction Type</label>
              <select
                value={filters.type || ""}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="payment">Payment</option>
                <option value="invoice">Invoice</option>
                <option value="refund">Refund</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          )}

          {report.filters.includes('dateRange') && (
            <>
              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </>
          )}

          {report.filters.includes('companyId') && (
            <div className="filter-group">
              <label>Company ID</label>
              <input
                type="text"
                placeholder="Enter company ID"
                value={filters.companyId || ""}
                onChange={(e) => handleFilterChange('companyId', e.target.value)}
              />
            </div>
          )}

          {report.filters.includes('userId') && (
            <div className="filter-group">
              <label>User ID</label>
              <input
                type="text"
                placeholder="Enter user ID"
                value={filters.userId || ""}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="generate-reports-container">
      <header className="reports-header">
        <div className="logo">RCMS</div>
        <h1>Generate Reports</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </header>

      <div className="reports-content">
        <div className="report-form-section">
          <h2>Report Generation</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={generateReport} className="report-form">
            <div className="form-group">
              <label>Select Report Type *</label>
              <select
                value={selectedReport}
                onChange={(e) => handleReportChange(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Choose a report type</option>
                {reportTypes.map(report => (
                  <option key={report.id} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedReport && (
              <>
                <div className="report-description">
                  {reportTypes.find(r => r.id === selectedReport)?.description}
                </div>

                <div className="form-group">
                  <label>Export Format *</label>
                  <div className="format-options">
                    {reportTypes.find(r => r.id === selectedReport)?.formats.map(fmt => (
                      <label key={fmt} className="format-option">
                        <input
                          type="radio"
                          name="format"
                          value={fmt}
                          checked={format === fmt}
                          onChange={(e) => setFormat(e.target.value)}
                          disabled={loading}
                        />
                        <span className="format-label">
                          {fmt.toUpperCase()}
                          {fmt === 'pdf' && ' 📄'}
                          {fmt === 'excel' && ' 📊'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {renderFilters()}
              </>
            )}

            <button
              type="submit"
              className="generate-report-btn"
              disabled={loading || !selectedReport}
            >
              {loading ? "Generating Report..." : "📊 Generate Report"}
            </button>
          </form>
        </div>

        <div className="report-info-section">
          <h2>Available Reports</h2>
          <div className="reports-list">
            {reportTypes.map(report => (
              <div key={report.id} className="report-info-card">
                <div className="report-icon">
                  {report.id.includes('project') && '🏗️'}
                  {report.id.includes('financial') && '💰'}
                  {report.id.includes('material') && '📦'}
                  {report.id.includes('user') && '👥'}
                  {report.id.includes('transaction') && '💳'}
                </div>
                <div className="report-details">
                  <h3>{report.name}</h3>
                  <p>{report.description}</p>
                  <div className="report-meta">
                    <span className="formats">
                      Formats: {report.formats.map(f => f.toUpperCase()).join(', ')}
                    </span>
                    <span className="filters-count">
                      {report.filters.length} filter{report.filters.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="report-tips">
            <h3>💡 Report Generation Tips</h3>
            <ul>
              <li>Choose appropriate filters to narrow down your report data</li>
              <li>PDF format is best for viewing and printing</li>
              <li>Excel format is ideal for data analysis and calculations</li>
              <li>Large date ranges may take longer to generate</li>
              <li>Reports include RCMS branding and professional formatting</li>
              <li>All reports are timestamped and include generation metadata</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReports;
