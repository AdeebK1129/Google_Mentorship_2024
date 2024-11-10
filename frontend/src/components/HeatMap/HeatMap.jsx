import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';
import './HeatMap.css';

const HeatMap = () => {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [districtData, setDistrictData] = useState({});
  const [maxValue, setMaxValue] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    console.log("Initializing district data with school counts...");
    const initialDistrictData = {};
    for (let i = 1; i <= 32; i++) {
      initialDistrictData[i] = 0;
    }
    setDistrictData(initialDistrictData);
    console.log("Initialized district data:", initialDistrictData);
  }, []);

  useEffect(() => {
    console.log("Fetching available metrics...");
    fetch('http://localhost:5004/metrics')
      .then(response => response.json())
      .then(data => {
        setMetrics(data.metrics);
        console.log("Metrics fetched:", data.metrics);
      })
      .catch(error => console.error("Error fetching metrics:", error));
  }, []);

  useEffect(() => {
    console.log("Loading GeoJSON data...");
    fetch('/school_districts.geojson')
      .then(response => response.json())
      .then(data => {
        setGeoJsonData(data);
        console.log("GeoJSON data loaded:", data);
      })
      .catch(error => console.error("Error loading GeoJSON data:", error));
  }, []);

  useEffect(() => {
    if (selectedMetric) {
      console.log(`Fetching district data for metric: ${selectedMetric}`);
      
      // Fetch district data
      fetch(`http://localhost:5004/districts?metric=${encodeURIComponent(selectedMetric)}`)
        .then(response => {
          if (!response.ok) throw new Error("Non-numeric data detected");
          return response.json();
        })
        .then(data => {
          setDistrictData(data.districtAverages);
          console.log("Updated district data:", data.districtAverages);
        })
        .catch(error => console.error("Error fetching district data:", error));
  
      // Fetch max individual school value for the color scale
      fetch(`http://localhost:5004/max_value?metric=${encodeURIComponent(selectedMetric)}`)
        .then(response => response.json())
        .then(data => {
          setMaxValue(data.maxValue);  // Set maxValue to dynamically update color scale
          console.log("Max value for color scale:", data.maxValue);
        })
        .catch(error => console.error("Error fetching max value:", error));
    }
  }, [selectedMetric]);

  useEffect(() => {
    if (geoJsonData && Object.keys(districtData).length > 0) {
      drawMap();
    } else {
      console.log("Map conditions not met, geoJsonData or districtData is missing.");
    }
  }, [geoJsonData, districtData, maxValue]);

  const drawMap = () => {
    console.log("Drawing map...");
    const width = 700;
    const height = 580;

    d3.select('#map').selectAll('*').remove();
    const svg = d3.select('#map')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoMercator().fitSize([width, height], geoJsonData);
    const path = d3.geoPath().projection(projection);

    // Set color scale based on maxValue for numeric and mapped categorical data
    const colorScale = d3.scaleLinear()
        .domain([0, maxValue || 1])  // Use dynamically fetched maxValue or 1 for mapped categories
        .range(["#e0f7fa", "#006064"]);

        svg.selectAll('path')
        .data(geoJsonData.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', d => {
            const district = d.properties.school_dist;
            const data = districtData[district];
    
            // Case 1: Numeric metric
            if (typeof data === 'number') {
                return colorScale(data);
            }
            // Case 2: Rating or Quality Review metric with averageScore
            if (data && typeof data === 'object' && data.hasOwnProperty('averageScore')) {
                return colorScale(data.averageScore);
            }
            // Case 3: Non-analytical non-numeric metric (e.g., School Name)
            return '#ddd';
        })
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5) // Default border width
        .on('mouseover', function (event, d) {
            const district = d.properties.school_dist;
            const data = districtData[district];
    
            // Increase border width on hover
            d3.select(this).attr('stroke-width', 2);
    
            let tooltipContent = `District: ${district}<br>`;
            if (selectedMetric) {
                // Show average metric or frequency based on data type
                if (typeof data === 'number') {
                    tooltipContent += `Average Metric: ${data.toFixed(2)}`;
                } else if (data && typeof data === 'object' && data.hasOwnProperty('frequency')) {
                    tooltipContent += `Frequency:<br>`;
                    Object.keys(data.frequency).forEach(key => {
                        tooltipContent += `${key}: ${data.frequency[key]}<br>`;
                    });
                } else if (data && typeof data === 'object' && data.hasOwnProperty('averageScore')) {
                    tooltipContent += `Average Score: ${data.averageScore.toFixed(2)}<br>Frequency:<br>`;
                    Object.keys(data.frequency).forEach(key => {
                        tooltipContent += `${key}: ${data.frequency[key]}<br>`;
                    });
                }
            }
    
            d3.select('#tooltip')
                .style('visibility', 'visible')
                .html(tooltipContent)
                .style('top', `${event.pageY - 10}px`)
                .style('left', `${event.pageX + 10}px`);
        })
        .on('mouseout', function () {
            // Reset border width on mouse out
            d3.select(this).attr('stroke-width', 0.5);
            d3.select('#tooltip').style('visibility', 'hidden');
        });
    

    drawLegend(colorScale);
    console.log("Map has been drawn.");
  };

  
  const drawLegend = (colorScale) => {
    console.log("Drawing legend...");
    const legendWidth = 300;
    const legendHeight = 20;
    const legendSvg = d3.select('#legend-gradient')
      .attr('width', legendWidth)
      .attr('height', legendHeight);
  
    // Clear any previous definitions
    legendSvg.selectAll("*").remove();
  
    const defs = legendSvg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');
    
    linearGradient.selectAll('stop')
      .data(colorScale.range().map((color, i) => ({
        offset: i / (colorScale.range().length - 1),
        color
      })))
      .enter().append('stop')
      .attr('offset', d => d.offset * 100 + '%')
      .attr('stop-color', d => d.color);
  
    legendSvg.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#linear-gradient)');
  
    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);
  
    const legendAxis = d3.axisBottom(legendScale).ticks(5);
    legendSvg.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis);
    console.log("Legend has been drawn.");
  };

  return (
    <div className="container mx-auto mt-6 p-4 bg-white rounded shadow flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">School Districts Map</h1>
      <div className="select-container">
      <Select
        options={metrics.map(metric => ({ label: metric, value: metric }))}
        onChange={(option) => setSelectedMetric(option ? option.value : '')}
        placeholder="Select a metric..."
        isClearable
      />
      </div>
      <svg id="map" className="border mx-auto mt-4" style={{ maxWidth: "700px", width: "100%" }}></svg>
      <div id="tooltip" className="tooltip"></div>
      <div id="legend" className="mt-4 flex justify-center items-center space-x-4">
        <div id="legend-min" className="text-right w-12">0</div>
        <svg id="legend-gradient" style={{ width: "300px", height: "20px" }}></svg>
        <div id="legend-max" className="text-left w-12">{maxValue !== null ? maxValue.toFixed(2) : '1'}</div>
      </div>
    </div>
  );
};

export default HeatMap;
