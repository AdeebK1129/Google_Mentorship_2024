import React from 'react';

const StatsSection = ({ heading, content, imageUrl, imagePosition = 'right' }) => {
  return (
    <div className={`stats-section ${imagePosition === 'left' ? 'left-image' : 'right-image'}`}>
      {imagePosition === 'left' && (
        <div className="stats-image">
          <img src={imageUrl} alt={heading} />
        </div>
      )}
      <div className="stats-content">
        <h2>{heading}</h2>
        <p>{content}</p>
      </div>
      {imagePosition === 'right' && (
        <div className="stats-image">
          <img src={imageUrl} alt={heading} />
        </div>
      )}
    </div>
  );
};

export default StatsSection;