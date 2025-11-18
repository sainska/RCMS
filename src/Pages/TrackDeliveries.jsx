import React from "react";
import "./TrackDeliveries.css";
import { useNavigate } from "react-router-dom";

const deliveries = [
  {
    item: "Cement Bags",
    company: "BuildKen Ltd.",
    inspected: "Yes",
    inspector: "Eng. Omondi",
    quantity: "200 Bags",
    status: "Delivered"
  },
  {
    item: "Steel Rods",
    company: "Metal Africa Co.",
    inspected: "Yes",
    inspector: "Eng. Njiru",
    quantity: "150 Pieces",
    status: "Delivered"
  },
  {
    item: "Bricks",
    company: "BrickMasters KE",
    inspected: "No",
    inspector: "-",
    quantity: "3,000 pcs",
    status: "In Progress"
  },
  {
    item: "Timber",
    company: "GreenWood Suppliers",
    inspected: "Yes",
    inspector: "Eng. Atieno",
    quantity: "120 Planks",
    status: "Delivered"
  },
  {
    item: "Paint",
    company: "ColorPro Ltd.",
    inspected: "Yes",
    inspector: "Eng. Kiptoo",
    quantity: "40 Buckets",
    status: "Not Yet Delivered"
  },
  {
    item: "Pipes",
    company: "HydroFlow Systems",
    inspected: "No",
    inspector: "-",
    quantity: "75 Units",
    status: "In Progress"
  }
];

const TrackDeliveries = () => {
  const navigate = useNavigate();

  return (
    <div className="track-deliveries-container">
      <header className="project-header">
        <div className="logo">RCMS</div>
        <div className="back-button" onClick={() => navigate(-1)}>&lt;</div>
      </header>

      <h2 className="track-title">Track Deliveries</h2>

      <div className="delivery-grid">
        {deliveries.map((delivery, index) => (
          <div key={index} className={`delivery-card ${delivery.status.toLowerCase().replace(/\s+/g, '-')}`}>
            <h3>{delivery.item}</h3>
            <p><span>Delivered By:</span> {delivery.company}</p>
            <p><span>Inspected:</span> {delivery.inspected}</p>
            <p><span>Inspector:</span> {delivery.inspector}</p>
            <p><span>Quantity:</span> {delivery.quantity}</p>
            <p className="status"><strong>Status:</strong> {delivery.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackDeliveries;
