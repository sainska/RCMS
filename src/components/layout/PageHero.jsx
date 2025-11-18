import React from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import "./page-hero.css";

const PageHero = ({ eyebrow, title, description, badges = [], actions = [] }) => {
  return (
    <section className="page-hero card-entrance">
      <div>
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        <h1 className="page-hero__title">{title}</h1>
        {description && <p className="page-hero__description">{description}</p>}
        {badges.length > 0 && (
          <div className="page-hero__badges">
            {badges.map((badge) => (
              <span key={badge.label} className={`page-hero__badge page-hero__badge--${badge.variant || "neutral"}`}>
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {actions.length > 0 && (
        <div className="page-hero__actions">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.label} variant={action.variant || "default"} onClick={action.onClick} className="action-button">
                {Icon && <Icon className="h-4 w-4" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </section>
  );
};

PageHero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(["success", "warning", "danger", "neutral"]),
    })
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      onClick: PropTypes.func,
      variant: PropTypes.oneOf(["default", "secondary", "outline"]),
    })
  ),
};

export default PageHero;

