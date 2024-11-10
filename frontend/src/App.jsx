import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './pages/Welcome';
import Homepage from './pages/Homepage';
import Heatmap from './components/HeatMap/HeatMap';

function App() {
  return (
      <div>
        <Routes>
          <Route index element={<Welcome />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/heatmap" element={<Heatmap />} />
        </Routes>
      </div>
  );
}

export default App;
