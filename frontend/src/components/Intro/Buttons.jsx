/**
 * Buttons Component
 * 
 * This component renders a section containing buttons and previews for navigating to the heatmap.
 * It provides a quick preview image of the heatmap along with a button for direct access.
 * 
 * Component Structure:
 * - Contains a preview image of the heatmap that links to the full heatmap page.
 * - Includes a button that provides an alternative way to navigate to the heatmap.
 * 
 * Props:
 * None
 * 
 * State:
 * None
 * 
 * CSS Classes:
 * - `right-panel`: Wrapper for the entire section, typically used for layout purposes.
 * - `heatmap-preview`: Container for the preview image of the heatmap, giving users a visual cue.
 * - `hmb-wrapper`: Wrapper for the button that links to the heatmap, used for styling.
 * - `heatmap-button`: Container for the button itself, ensuring consistent styling.
 * 
 * @returns {JSX.Element} A React component that renders buttons and heatmap previews.
 */
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