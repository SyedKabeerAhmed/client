import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color = 'blue', trend, subtitle }) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__header">
        <div className="stats-card__icon">
          <i className={icon}></i>
        </div>
        {trend && (
          <div className={`stats-card__trend ${trend.type}`}>
            <i className={`fas fa-arrow-${trend.type === 'up' ? 'up' : 'down'}`}></i>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      
      <div className="stats-card__content">
        <h3 className="stats-card__value">{value}</h3>
        <p className="stats-card__title">{title}</p>
        {subtitle && (
          <p className="stats-card__subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
