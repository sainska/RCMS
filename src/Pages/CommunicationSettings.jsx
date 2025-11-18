import React, { useState } from "react";
import "./CommunicationSettings.css";

const CommunicationSettings = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    notifications: true,
  });

  const togglePreference = (type) => {
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="communication-settings-container">
      <h2>Communication Settings</h2>
      <p className="description">
        Customize how you'd like to receive updates about your team and project assignments.
      </p>

      <div className="toggle-options">
        <div className="toggle-card">
          <h4>Email Notifications</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={preferences.email}
              onChange={() => togglePreference("email")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-card">
          <h4>SMS Alerts</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={preferences.sms}
              onChange={() => togglePreference("sms")}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="toggle-card">
          <h4>In-App Notifications</h4>
          <label className="switch">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={() => togglePreference("notifications")}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CommunicationSettings;
