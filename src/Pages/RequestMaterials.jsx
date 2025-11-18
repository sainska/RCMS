import React, { useState } from "react";
import { useAppContext } from '../AppContext';
import { API_BASE } from '../utils/api';
import axios from "axios";
import "./RequestMaterials.css";

const RequestMaterials = () => {
  const [materials, setMaterials] = useState([
    { name: "", quantity: "", cost: "", urgency: "Normal", notes: "" }
  ]);

  const [previousRequests, setPreviousRequests] = useState([]);

  const handleChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const addMaterialRow = () => {
    setMaterials([
      ...materials,
      { name: "", quantity: "", cost: "", urgency: "Normal", notes: "" }
    ]);
  };

  const { user, selectedProject } = useAppContext();
  const companyId = user?.companyId;
  const projectId = selectedProject?.projectId || selectedProject?._id;

  const submitRequest = async () => {
    // Debug log context values before sending request
    console.log("Submitting material request with:", { companyId, projectId, materials });
    if (!companyId || !projectId) {
      alert("Error: Company ID or Project ID is missing. Please select a project and ensure you are logged in.");
      return;
    }
    try {
      const payload = {
        companyId,
        projectId,
        materials
      };
  await axios.post(`${API_BASE}/api/materials/request`, payload);
      alert("Material request sent to Project Manager successfully!");
      setPreviousRequests([...previousRequests, ...materials]);
      setMaterials([{ name: "", quantity: "", cost: "", urgency: "Normal", notes: "" }]);
    } catch (error) {
      console.error("Error submitting material request:", error);
      alert("Failed to submit material request.");
    }
  };

  return (
    <div className="request-materials-container">
      <div className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => window.history.back()}>&lt;</div>
      </div>

      <h2 className="materials-title">Request Materials</h2>

      <div className="form-section">
        {materials.map((material, index) => (
          <div key={index} className="material-form">
            <div className="form-group">
              <label>Material Name</label>
              <input
                type="text"
                value={material.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={material.quantity}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Estimated Cost (Ksh)</label>
              <input
                type="number"
                value={material.cost}
                onChange={(e) => handleChange(index, "cost", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Urgency</label>
              <select
                value={material.urgency}
                onChange={(e) => handleChange(index, "urgency", e.target.value)}
              >
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                rows={2}
                value={material.notes}
                onChange={(e) => handleChange(index, "notes", e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="buttons">
          <button className="add-btn" onClick={addMaterialRow}>+ Add Material</button>
          <button className="submit-btn" onClick={submitRequest}>Send Request to Project Manager</button>
        </div>
      </div>

      <h2 className="materials-title" style={{ marginTop: "3rem" }}>Previous Requests</h2>
      <div className="previous-requests">
        {previousRequests.length === 0 ? (
          <p className="no-requests">No previous material requests yet.</p>
        ) : (
          previousRequests.map((item, idx) => (
            <div className="request-card" key={idx}>
              <h4>{item.name}</h4>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Estimated Cost:</strong> Ksh {item.cost}</p>
              <p><strong>Urgency:</strong> {item.urgency}</p>
              {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestMaterials;
