import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import StateMessage from "@/components/feedback/StateMessage";
import "./dashboard.css";

const MediaGallery = ({ title, description, items = [] }) => {
  return (
    <Card className="dashboard-media">
      <CardHeader>
        <CardTitle className="dashboard-media__title">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {items.length === 0 && (
          <StateMessage type="empty" title="No media yet" description="Uploads will appear here." />
        )}
        <div className="dashboard-media__grid">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <figure key={`${item.label}-${item.timestamp}`} className="dashboard-media__item">
                <div className="dashboard-media__icon">{Icon ? <Icon /> : "📷"}</div>
              <figcaption>
                <p className="dashboard-media__label">{item.label}</p>
                <p className="dashboard-media__timestamp">{item.timestamp}</p>
              </figcaption>
            </figure>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

MediaGallery.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ),
};

export default MediaGallery;

