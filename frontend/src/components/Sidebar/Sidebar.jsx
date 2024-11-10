import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="menu-item">Menu</div>
      <div className="menu-item">Top Schools</div>
      <div className="menu-item">Compare Schools</div>
      <div className="menu-item">Student Outcomes</div>
      <div className="menu-item">Settings</div>
      <div className="menu-item search-bar">
        <input type="text" placeholder="Search..." />
      </div>
    </div>
  );
};

export default Sidebar;
