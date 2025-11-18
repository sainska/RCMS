import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import "./dashboard.css";

const StatsGrid = ({ title, ctaLabel, onCtaClick, stats = [] }) => {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section__header">
        <div>
          {title && <h2 className="dashboard-section__title">{title}</h2>}
          {stats?.length > 0 && (
            <p className="dashboard-section__helper">Tracking live performance across key metrics</p>
          )}
        </div>
        {ctaLabel && (
          <button type="button" className="dashboard-section__cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        )}
      </div>

      <div className="dashboard-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="dashboard-stat-card">
              <CardHeader className="dashboard-stat-card__header">
                <CardTitle className="dashboard-stat-card__title">{stat.title}</CardTitle>
                {Icon && (
                  <span className={`dashboard-stat-card__icon dashboard-stat-card__icon--${stat.variant || "default"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                )}
              </CardHeader>
              <CardContent className="dashboard-stat-card__content">
                <div className="dashboard-stat-card__value">{stat.value}</div>
                <div className="dashboard-stat-card__meta">
                  <span
                    className={`dashboard-stat-card__trend dashboard-stat-card__trend--${stat.trend || "neutral"}`}
                  >
                    {stat.change}
                  </span>
                  {stat.helper && <span className="dashboard-stat-card__helper">{stat.helper}</span>}
                </div>
                {stat.description && <CardDescription>{stat.description}</CardDescription>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

StatsGrid.propTypes = {
  title: PropTypes.string,
  ctaLabel: PropTypes.string,
  onCtaClick: PropTypes.func,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      change: PropTypes.string,
      trend: PropTypes.oneOf(["up", "down", "neutral"]),
      helper: PropTypes.string,
      description: PropTypes.string,
      icon: PropTypes.elementType,
      variant: PropTypes.string,
    })
  ),
};

export default StatsGrid;

