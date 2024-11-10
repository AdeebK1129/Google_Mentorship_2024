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