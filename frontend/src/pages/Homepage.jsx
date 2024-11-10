import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import MainContent from '../components/MainContent/MainContent';
const Homepage = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Homepage;
