/**
 * StatsSection Component
 * 
 * This component renders a section with statistical information, including a heading, content, and an optional image.
 * The image can be positioned either to the right or left of the text, depending on the `imagePosition` prop value.
 * It is a reusable component designed for use across the application wherever statistical information needs
 * to be presented with an accompanying visual representation.
 * 
 * Component Structure:
 * - The main container (`stats-section`) contains the heading, content, and an optional image.
 * - The image can be placed to the left or right of the content, based on the value of the `imagePosition` prop.
 * - CSS class names (`left-image` or `right-image`) dynamically alter the layout to align the image accordingly.
 * 
 * Props:
 * - `heading` (string): The heading text that describes the statistical data or section topic.
 * - `content` (string): The descriptive text that explains the statistics or provides context.
 * - `imageUrl` (string): The URL to the image resource used to visually enhance the content.
 * - `imagePosition` (string): Optional prop to control the position of the image. Accepts 'left' or 'right'. Defaults to 'right'.
 * 
 * State:
 * None
 * 
 * CSS Classes:
 * - `stats-section`: The main container class that provides base styling for the section.
 * - `left-image` / `right-image`: Modifier classes that control whether the image is on the left or right side.
 * - `stats-image`: Container class for the image element, which provides consistent styling for images.
 * - `stats-content`: Container for the heading and content text, ensuring proper layout and spacing.
 * 
 * Usage:
 * This component is useful for presenting detailed insights about a specific aspect of the platform,
 * such as statistical data, comparisons, or any other information that benefits from both text and visual context.
 * 
 * Example Usage:
 * ```
 * <StatsSection
 *   heading="Student Attendance Rates"
 *   content="The attendance rates in this district have improved by 15% over the past year."
 *   imageUrl="/images/attendance.png"
 *   imagePosition="left"
 * />
 * ```
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.heading - The heading for the statistics section.
 * @param {string} props.content - The content describing the statistics.
 * @param {string} props.imageUrl - The URL of the image to display.
 * @param {string} props.imagePosition - Determines the placement of the image relative to the content ('left' or 'right').
 * 
 * @returns {JSX.Element} A React component that renders a statistics section with optional image positioning.
 */

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