import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span>PROGRESS</span>
        <span>
          <strong>{current}</strong> / {total} answered ({percentage}%)
        </span>
      </div>
      <div className="progress-track">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
