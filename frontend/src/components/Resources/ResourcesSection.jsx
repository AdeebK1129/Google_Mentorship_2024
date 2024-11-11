/**
 * ResourcesSection Component
 * 
 * This component renders a section with resources targeted at different educational levels, including Elementary,
 * Middle, and High School. The resources provide guidance and information on how students and parents can prepare
 * for future educational milestones.
 * 
 * Component Structure:
 * - The main container consists of a heading and multiple resource columns.
 * - Each column represents a specific school level, containing an icon, a heading, and a description.
 * 
 * Props:
 * None
 * 
 * State:
 * None
 * 
 * CSS Classes:
 * - `resources-section`: Main container for the resources section.
 * - `resources-heading`: CSS class for the section heading, used for styling the header.
 * - `resource-columns`: Wrapper for individual resource columns to align them properly.
 * - `resource-column`: Container for each individual resource item, including an icon, heading, and description.
 * - `icon-placeholder`: CSS class for the icon container, used for visual representation of each resource.
 * 
 * @returns {JSX.Element} A React component that renders the resources section with different educational guides.
 */
import React from 'react';

const ResourcesSection = () => {
  return (
    <div className="resources-section">
      <h1 className="resources-heading">Preparing for the Future</h1>
      <div className="resource-columns">
        <div className="resource-column">
          <div className="icon-placeholder"><img src="/images/elementary.svg" alt="ES Icon" /></div>
          <h2>Elementary School</h2>
          <p>
            Prepare for Gifted and Talented (G&T) programs by researching testing dates and requirements. Utilize resources for New State Test preparation, and consult with local librarians for study tips and materials.
          </p>
        </div>
        <div className="resource-column">
          <div className="icon-placeholder"><img src="/images/middle.svg" alt="MS Icon" /></div>
          <h2>Middle School</h2>
          <p>
            Access NYC Regents resources, prepare for the SHSAT, and explore after-school activities available for NYCDOE students to enhance learning and development.
          </p>
        </div>
        <div className="resource-column">
          <div className="icon-placeholder"><img src="/images/high.svg" alt="HS Icon" /></div>
          <h2>High School</h2>
          <p>
            Prepare for the ACT and SAT, understand the Common App process, and get advice on applying for colleges. Gather accurate and helpful information to plan for your future education.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesSection;