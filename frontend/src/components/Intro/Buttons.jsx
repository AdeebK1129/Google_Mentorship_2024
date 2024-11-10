import React from 'react';

const Buttons = () => {
  return (
    <div className="right-panel">
      <div className="heatmap-preview">
      <a href="/heatmap"><img src="/images/heatmappreview.png" alt="Heatmap Preview" /></a>
      </div>
      <div className="hmb-wrapper">
        <div className="heatmap-button">
          <a href="/heatmap"><button>View the Heatmap here!</button></a>
        </div>
      </div>
    </div>
  );
};

export default Buttons;