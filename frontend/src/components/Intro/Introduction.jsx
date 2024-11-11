/**
 * Introduction Component
 * 
 * This component renders the introduction section of the page, providing context and purpose for the platform.
 * It aims to engage users by explaining the motivation behind the site and its focus on educational disparities.
 * 
 * Component Structure:
 * - The main container consists of an illustration and a text section introducing the platform.
 * - Includes an image that serves as a visual representation, followed by a heading and a descriptive paragraph.
 * 
 * Props:
 * None
 * 
 * State:
 * None
 * 
 * CSS Classes:
 * - `left-panel`: Wrapper for the entire introduction section, typically used for layout purposes.
 * - `illustration`: Container for the image that visually supports the introduction.
 * - `people`: Image ID for targeting specific styling of the illustration.
 * 
 * @returns {JSX.Element} A React component that renders the introduction section of the page.
 */
import React from 'react';

const Introduction = () => {
  return (
    <div className="left-panel">
      <div className="illustration">
        <img id="people" src="/images/illustration.png" alt="Illustration"/>
      </div>
      <h1>City Learn: Explore Educational Data</h1>
      <p>
        Welcome to City Learn, your gateway to understanding educational disparities within the New York City Department of Education (NYCDOE). Our platform is dedicated to shedding light on the crucial aspects of educational inequality and data access disparities across NYC’s diverse school districts. In our research, we’ve uncovered significant variations in resources, student outcomes, and overall educational quality. By navigating through our site, you’ll gain insights into these disparities through carefully curated data and visualizations.
      </p>
    </div>
  );
};

export default Introduction;
