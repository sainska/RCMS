import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import "./dashboard.css";

const SummaryCard = ({ title, description, icon: Icon, metrics = [], footer }) => {
  return (
    <Card className="dashboard-summary">
      <CardHeader className="dashboard-summary__header">
        <div className="dashboard-summary__title-group">
          {Icon && (
            <span className="dashboard-summary__icon">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <CardTitle className="dashboard-summary__title">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="dashboard-summary__content">
        {metrics.map((metric) => (
          <div key={metric.label} className="dashboard-summary__row">
            <span className="dashboard-summary__row-label">{metric.label}</span>
            <span className={`dashboard-summary__row-value dashboard-summary__row-value--${metric.accent || "default"}`}>
              {metric.value}
            </span>
          </div>
        ))}
        {footer && (
          <div className="dashboard-summary__footer">
            <p className="dashboard-summary__footer-label">{footer.label}</p>
            <p className="dashboard-summary__footer-value">{footer.value}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      accent: PropTypes.oneOf(["default", "success", "warning", "danger", "info"]),
    })
  ),
  footer: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
};

export default SummaryCard;

