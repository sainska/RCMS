import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import StateMessage from "@/components/feedback/StateMessage";
import "./dashboard.css";

const ActivityFeed = ({ title, description, items = [] }) => {
  return (
    <Card className="dashboard-activity">
      <CardHeader>
        <CardTitle className="dashboard-activity__title">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="dashboard-activity__content">
        {items.length === 0 && (
          <StateMessage type="empty" title="Nothing to report" description="All caught up for now." />
        )}
        {items.map((item) => (
          <div key={`${item.title}-${item.timestamp}`} className={`dashboard-activity__item dashboard-activity__item--${item.variant || "info"}`}>
            <div className="dashboard-activity__status" aria-hidden="true" />
            <div className="dashboard-activity__body">
              <p className="dashboard-activity__item-title">{item.title}</p>
              <p className="dashboard-activity__item-meta">{item.meta}</p>
            </div>
            <span className="dashboard-activity__timestamp">{item.timestamp}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

ActivityFeed.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      meta: PropTypes.string,
      timestamp: PropTypes.string,
      variant: PropTypes.oneOf(["success", "warning", "info", "danger"]),
    })
  ),
};

export default ActivityFeed;

