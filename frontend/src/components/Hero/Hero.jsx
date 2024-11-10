import React from 'react';
import './Hero.css'; // Assuming the CSS file for hero is Hero.css

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