import React from "react";
import PropTypes from "prop-types";
import "./StateMessage.css";

const icons = {
  empty: "📭",
  error: "⚠️",
  success: "✅",
  info: "ℹ️",
};

const StateMessage = ({ type = "empty", title, description, actionLabel, onAction }) => {
  return (
    <div className={`state-message state-message--${type}`}>
      <span className="state-message__icon" aria-hidden="true">
        {icons[type] || icons.info}
      </span>
      {title && <p className="state-message__title">{title}</p>}
      {description && <p className="state-message__description">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="state-message__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

StateMessage.propTypes = {
  type: PropTypes.oneOf(["empty", "error", "success", "info"]),
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

export default StateMessage;

