import React from "react";
import "./ToolsResources.css";
import { FaFileDownload, FaUpload, FaBookOpen, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ToolsResources = () => {
  const navigate = useNavigate();

  const handleDownloadReport = () => {
    const select = document.querySelector('.report-select');
    const selectedReport = select.value;
    
    if (selectedReport === "Select a Report") {
      alert("Please select a report to download.");
      return;
    }
    
    // Create sample report data
    const reportData = {
      "progress": "Project Progress Report - Generated on " + new Date().toLocaleDateString(),
      "schedule": "Project Schedule Summary - Generated on " + new Date().toLocaleDateString(),
      "finance": "Financial Breakdown Report - Generated on " + new Date().toLocaleDateString()
    };
    
    const content = reportData[selectedReport] || "Report data not available";
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedReport}_report.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert(`${selectedReport} report downloaded successfully!`);
  };

  const handleUploadDocument = () => {
    const fileInput = document.querySelector('.upload-input');
    const file = fileInput.files[0];
    
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    
    // Simulate file upload
    setTimeout(() => {
      alert(`Document "${file.name}" uploaded successfully!`);
      fileInput.value = ''; // Clear the input
    }, 1000);
  };

  const handleViewGuides = () => {
    alert("Opening construction guides and safety manuals...");
    // In a real app, this would navigate to a guides page or open a PDF
  };

  const handleViewFAQs = () => {
    alert("Opening FAQs and help section...");
    // In a real app, this would navigate to an FAQ page
  };
  return (
    <div className="tools-resources-container">
      {/* Header */}
      <header className="tools-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => window.history.back()}>&lt;</div>
      </header>

      <h2 className="tools-title">Tools & Resources</h2>

      <div className="tools-grid">
        {/* Download Reports */}
        <div className="tool-card">
          <FaFileDownload className="tool-icon" />
          <h3>Download Reports</h3>
          <select className="report-select">
            <option>Select a Report</option>
            <option value="progress">Progress Report</option>
            <option value="schedule">Schedule Summary</option>
            <option value="finance">Financial Breakdown</option>
          </select>
          <button className="tool-btn" onClick={handleDownloadReport}>Download</button>
        </div>

        {/* Upload Documents */}
        <div className="tool-card">
          <FaUpload className="tool-icon" />
          <h3>Upload Documents</h3>
          <input type="file" className="upload-input" />
          <button className="tool-btn" onClick={handleUploadDocument}>Upload</button>
        </div>

        {/* Guides & Manuals */}
        <div className="tool-card">
          <FaBookOpen className="tool-icon" />
          <h3>Guides & Manuals</h3>
          <p>Access construction guides and safety manuals.</p>
          <button className="tool-btn" onClick={handleViewGuides}>View Guides</button>
        </div>

        {/* FAQs & Help */}
        <div className="tool-card">
          <FaInfoCircle className="tool-icon" />
          <h3>FAQs & Help</h3>
          <p>Get answers to frequently asked questions.</p>
          <button className="tool-btn" onClick={handleViewFAQs}>View FAQs</button>
        </div>
      </div>
    </div>
  );
};

export default ToolsResources;
