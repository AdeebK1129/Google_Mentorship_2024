/**
 * Hero Component
 * 
 * This component renders the main hero section for the page, providing a powerful visual statement
 * about educational inequality in New York City. The hero section includes a masked background image
 * with text overlay, highlighting the significant funding gap between wealthy and poor districts.
 * 
 * Component Structure:
 * - The main container has a background mask to provide visual contrast for the overlaid text.
 * - The overlay includes a heading and a subheading summarizing key information about the inequality gap.
 * 
 * Props:
 * None
 * 
 * State:
 * None
 * 
 * CSS Classes:
 * - `hero`: Main container for the hero section, typically used for background styling.
 * - `mask`: Applies a dark overlay on the hero background to improve text readability.
 * - `text-white`: Ensures that the text is white for better contrast against the background.
 * @returns {JSX.Element} A React component that renders the hero section.
 */
import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <div className="hero">
      <div className="mask">
        <div className="text-white">
          <h1 class="mb-3">New York’s Educational Inequality Gap: $8,733 Per Pupil</h1>
          <h4 class="mb-3">Wealthy districts spend $8,733 more per student than poor districts, perpetuating disparities and limiting opportunities for thousands of students. Let's explore the data and understand the impact.</h4>
        </div>
      </div>
    </div>
  );
}

export default Hero;