import React from 'react';
import './StatusFilter.css';

const StatusFilter = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="status-filter">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
          {filter.count !== undefined && (
            <span className="filter-count">({filter.count})</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
