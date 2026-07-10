import React from 'react';

function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      <div className="skeleton-header"></div>
      <div className="skeleton-body">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
      <div className="skeleton-table"></div>
    </div>
  );
}

export default SkeletonLoader;
