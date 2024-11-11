/**
 * MainContent Component
 * 
 * This component renders the main content for the page, providing detailed information about a specific school,
 * including key statistics and an overview of the school in the context of its district.
 * 
 * Component Structure:
 * - The main container includes a header with the school name and district information.
 * - An overview section compares key metrics like enrollment, attendance, and graduation rates with district averages.
 * - An additional information section provides more context and background about the school.
 * 
 * Props:
 * None
 * 
 * State:
 * None
 * 
 * CSS Classes:
 * - `main-content`: Main container for the content section.
 * - `header`: Container for the school name and district information.
 * - `overview`: Container for the overview statistics, including comparisons with district averages.
 * - `overview-stats`: Wrapper for individual statistics within the overview section.
 * - `stat`: Container for each individual statistic, including an icon, title, and value.
 * - `graph-bars`: CSS class for the icon used to represent the statistics visually.
 * - `additional-info`: Container for additional information about the school, providing context and background.
 * 
 * @returns {JSX.Element} A React component that renders the main content section of the page.
 */
import React from 'react';
import './MainContent.css';
const MainContent = () => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Stuyvesant High School</h1>
        <h2>District 2</h2>
      </div>
      <div className="overview">
        <h3>Overview (vs District Avg)</h3>
        <div className="overview-stats">
          <div className="stat">
            <img className="graph-bars" src="/images/chart-simple-solid.svg"></img>
            <div className="stat-title">Enrollment</div>
            <div className="stat-value">5.67%</div>
          </div>
          <div className="stat">
            <img className="graph-bars" src="/images/chart-simple-solid.svg"></img>
            <div className="stat-title">Attendance</div>
            <div className="stat-value">21.86%</div>
          </div>
          <div className="stat">
            <img className="graph-bars" src="/images/chart-simple-solid.svg"></img>
            <div className="stat-title">Graduation</div>
            <div className="stat-value">7.86%</div>
          </div>
        </div>
      </div>
      <div className="additional-info">
        <h3>Additional Information</h3>
        <p>
        Stuyvesant High School is a specialized high school in New York City, renowned for its rigorous academic programs and focus on science, technology, engineering, and mathematics (STEM). Established in 1904, it is one of nine specialized high schools in NYC that requires students to pass the Specialized High Schools Admissions Test (SHSAT) for admission. Known for its competitive environment and high academic standards, Stuyvesant has produced many notable alumni, including Nobel laureates, government officials, and leaders in various fields. The school consistently ranks among the top public high schools in the United States.
        </p>
      </div>
    </div>
  );
};

export default MainContent;
