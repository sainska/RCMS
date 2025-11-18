import React from "react";
import PropTypes from "prop-types";
import "./section-card.css";

const SectionCard = ({ title, description, toolbar, children, footer }) => {
  return (
    <section className="section-card card-entrance">
      {(title || toolbar) && (
        <header className="section-card__header">
          <div>
            {title && <h2 className="section-card__title">{title}</h2>}
            {description && <p className="section-card__description">{description}</p>}
          </div>
          {toolbar && <div className="section-card__toolbar">{toolbar}</div>}
        </header>
      )}
      <div className="section-card__content">{children}</div>
      {footer && <footer className="section-card__footer">{footer}</footer>}
    </section>
  );
};

SectionCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  toolbar: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default SectionCard;

