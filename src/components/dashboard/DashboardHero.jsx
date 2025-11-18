import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import "./dashboard.css";

const DashboardHero = ({
  eyebrow,
  title,
  description,
  highlightLabel,
  highlightValue,
  highlightHelper,
  actions = [],
  onNavigate,
}) => {
  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero__background" />
      <div className="dashboard-hero__content">
        {eyebrow && <p className="dashboard-hero__eyebrow">{eyebrow}</p>}
        <h1 className="dashboard-hero__title">{title}</h1>
        {description && <p className="dashboard-hero__description">{description}</p>}

        {actions.length > 0 && (
          <div className="dashboard-hero__actions">
            {actions.map((action) => {
              const Icon = action.icon;
              const handleClick = () => {
                if (action.onClick) {
                  action.onClick();
                  return;
                }
                if (action.route && onNavigate) {
                  onNavigate(action.route);
                }
              };
              return (
                <Button
                  key={action.label}
                  variant={action.variant || "secondary"}
                  className={`dashboard-hero__action ${action.className || ""}`}
                  onClick={handleClick}
                  type="button"
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
      <div className="dashboard-hero__highlight">
        <p className="dashboard-hero__highlight-label">{highlightLabel}</p>
        <p className="dashboard-hero__highlight-value">{highlightValue}</p>
        {highlightHelper && <p className="dashboard-hero__highlight-helper">{highlightHelper}</p>}
      </div>
    </section>
  );
};

DashboardHero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  highlightLabel: PropTypes.string,
  highlightValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  highlightHelper: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      route: PropTypes.string,
      onClick: PropTypes.func,
      variant: PropTypes.oneOf(["default", "secondary", "outline"]),
      className: PropTypes.string,
    })
  ),
  onNavigate: PropTypes.func,
};

export default DashboardHero;

