import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';
import './HeatMap.css';

const HeatMap = () => {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedSchoolType, setSelectedSchoolType] = useState('hs');
  const [districtData, setDistrictData] = useState({});
  const [maxValue, setMaxValue] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [isMapReset, setIsMapReset] = useState(false); // Track if the map needs a reset

  const drawMap = () => {
    //console.log("Attempting to draw the map...");
    const width = 700;
    const height = 580;

    if (!geoJsonData) {
      //console.warn("GeoJSON data is null, cannot draw the map.");
      return;
    }

    //console.log("Clearing previous map elements...");
    d3.select('#map').selectAll('*').remove();

    const svg = d3.select('#map')
      .attr('width', width)
      .attr('height', height);

    const projection = d3.geoMercator().fitSize([width, height], geoJsonData);
    const path = d3.geoPath().projection(projection);

    //console.log("Setting color scale based on maxValue:", maxValue);
    const colorScale = d3.scaleLinear()
      .domain([0, maxValue || 1])
      .range(["#e0f7fa", "#006064"]);

    //console.log("Drawing map paths...");
    svg.selectAll('path')
      .data(geoJsonData.features)
      .enter().append('path')
      .attr('d', path)
      .attr('fill', d => {
        const district = d.properties.school_dist;

        if (selectedMetric && districtData && districtData.hasOwnProperty(district)) {
          const data = districtData[district];

          if (data === undefined || data === null) {
            //console.warn(`Data for district ${district} is undefined. Defaulting to #ccc.`);
            return '#ccc';
          }

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
        } else {
          //console.log(`No data for district ${district}. Filling with default color #ccc.`);
          return '#ccc';
        }
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .on('mouseover', function (event, d) {
        const district = d.properties.school_dist;
        d3.select(this).attr('stroke-width', 2);

        let tooltipContent = `District: ${district}<br>`;

        if (selectedMetric && districtData && districtData.hasOwnProperty(district)) {
          const data = districtData[district];

          if (typeof data === 'number') {
            tooltipContent += `Average Metric: ${data ? data.toFixed(2) : "N/A"}`;
          } else if (data && typeof data === 'object' && data.hasOwnProperty('frequency')) {
            tooltipContent += `Frequency:<br>`;
            Object.keys(data.frequency).forEach(key => {
              tooltipContent += `${key}: ${data.frequency[key]}<br>`;
            });
          } else if (data && typeof data === 'object' && data.hasOwnProperty('averageScore')) {
            tooltipContent += `Average Score: ${data.averageScore ? data.averageScore.toFixed(2) : "N/A"}<br>Frequency:<br>`;
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
        d3.select(this).attr('stroke-width', 0.5);
        d3.select('#tooltip').style('visibility', 'hidden');
      });

    if (selectedMetric) {
      drawLegend(colorScale);
    }
    //console.log("Map drawing completed.");
  };

  const drawLegend = (colorScale) => {
    //console.log("Drawing legend with color scale...");
    const legendWidth = 300;
    const legendHeight = 20;
    const legendSvg = d3.select('#legend-gradient')
      .attr('width', legendWidth)
      .attr('height', legendHeight);

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
    //onsole.log("Legend drawing completed.");
  };

  useEffect(() => {
    //console.log("Fetching available metrics for school type:", selectedSchoolType);
    setSelectedMetric(null);
    setDistrictData({});
    setMaxValue(null);
    setIsMapReset(true); // Indicate map needs a reset
    d3.select('#map').selectAll('*').remove(); // Clear the map immediately

    fetch(`http://localhost:5004/metrics?schoolType=${selectedSchoolType}`)
      .then(response => response.json())
      .then(data => {
        setMetrics(data.metrics);
        //console.log("Metrics fetched:", data.metrics);
      })
      .catch(error => console.error("Error fetching metrics:", error));
  }, [selectedSchoolType]);

  useEffect(() => {
    //console.log("Loading GeoJSON data...");
    fetch('/school_districts.geojson')
      .then(response => response.json())
      .then(data => {
        if (!data || !data.features) {
          console.error("Invalid GeoJSON data:", data);
          return;
        }
        setGeoJsonData(data);
        //console.log("GeoJSON data loaded:", data);
      })
      .catch(error => console.error("Error loading GeoJSON data:", error));
  }, []);

  useEffect(() => {
    if (isMapReset && geoJsonData) {
      //console.log("Resetting map to initial state...");
      drawMap(); // Draw the map in the reset state with no metric selected
      setIsMapReset(false); // Map has been reset
    }
  }, [geoJsonData, isMapReset]);

  useEffect(() => {
    if (selectedMetric) {
      //console.log(`Fetching district data for metric: ${selectedMetric} and schoolType: ${selectedSchoolType}`);

      fetch(`http://localhost:5004/districts?metric=${encodeURIComponent(selectedMetric)}&schoolType=${selectedSchoolType}`)
        .then(response => {
          if (!response.ok) throw new Error("Non-numeric data detected");
          return response.json();
        })
        .then(data => {
          if (!data || !data.districtAverages) {
            //console.warn("No valid district averages received. Setting districtData to empty.");
            setDistrictData({});
          } else {
            setDistrictData(data.districtAverages);
            //console.log("Updated district data:", data.districtAverages);
            drawMap();
          }
        })
        .catch(error => {
          console.error("Error fetching district data:", error);
          setDistrictData({});
        });

      fetch(`http://localhost:5004/max_value?metric=${encodeURIComponent(selectedMetric)}&schoolType=${selectedSchoolType}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.maxValue) {
            setMaxValue(data.maxValue);
            //console.log("Max value for color scale:", data.maxValue);
          } else {
            //console.warn("Invalid max value received. Defaulting maxValue to 1.");
            setMaxValue(1);
          }
        })
        .catch(error => {
          console.error("Error fetching max value:", error);
          setMaxValue(1);
        });
    }
  }, [selectedMetric, selectedSchoolType]);

  useEffect(() => {
    if (geoJsonData && Object.keys(districtData).length > 0) {
      //console.log("All map conditions met. Drawing map...");
      drawMap();
    } else {
      //console.warn("Map conditions not fully met, skipping drawMap().");
    }
  }, [geoJsonData, districtData, maxValue, selectedMetric]);

  const handleSchoolTypeChange = (event) => {
    const newSchoolType = event.target.value;
    //console.log(`*******PREPARING SWITCH************`);
    //console.log(`School type changed to: ${newSchoolType}`);
    setSelectedSchoolType(newSchoolType);
  };

  return (
    <div className="container mx-auto mt-6 p-4 bg-white rounded shadow flex flex-col items-center">
      <h1 className="text-xl font-bold mb-4">School Districts Map</h1>

      {/* School Type Radio Buttons */}
      <div className="mb-4">
        <label>
          <input type="radio" value="hs" checked={selectedSchoolType === 'hs'} onChange={handleSchoolTypeChange} />
          High School
        </label>
        <label className="ml-4">
          <input type="radio" value="ems" checked={selectedSchoolType === 'ems'} onChange={handleSchoolTypeChange} />
          Elementary & Middle School
        </label>
        <label className="ml-4">
          <input type="radio" value="hst" checked={selectedSchoolType === 'hst'} onChange={handleSchoolTypeChange} />
          Transfer High School
        </label>
        <label className="ml-4">
          <input type="radio" value="d75" checked={selectedSchoolType === 'd75'} onChange={handleSchoolTypeChange} />
          District 75 Schools
        </label>
        <label className="ml-4">
          <input type="radio" value="ec" checked={selectedSchoolType === 'ec'} onChange={handleSchoolTypeChange} />
          Early Childhood Schools
        </label>
      </div>

      <div className="select-container">
        <Select
          value={selectedMetric ? { label: selectedMetric, value: selectedMetric } : null}
          options={metrics.map(metric => ({ label: metric, value: metric }))}
          onChange={(option) => setSelectedMetric(option ? option.value : null)}
          placeholder="Select a metric..."
          isClearable
        />
      </div>
      <svg id="map" className="border mx-auto mt-4" style={{ maxWidth: "700px", width: "100%" }}></svg>
      <div id="tooltip" className="tooltip"></div>
      <div id="legend" className="mt-4 flex justify-center items-center space-x-4">
        <div id="legend-min" className="text-right w-12">0</div>
        <svg id="legend-gradient" style={{ width: "300px", height: "20px" }}></svg>
        <div id="legend-max" className="text-left w-12">{maxValue !== null && !isNaN(maxValue) ? maxValue.toFixed(2) : '1'}</div>
      </div>
    </div>
  );
};

export default HeatMap;
