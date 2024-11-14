import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';
import './HeatMap.css';

/**
 * A React component that renders a geographical heatmap of school districts.
 * Visualizes district-level metrics using color gradients and provides interactive
 * features like tooltips and metric selection.
 *
 * The component fetches data from a Flask backend and uses D3.js for rendering.
 *
 * @returns {JSX.Element} A React component containing the heatmap visualization
 */
const HeatMap = () => {
  // State variables for managing data and user selection
  const [metrics, setMetrics] = useState([]); // Stores available metric options from the backend
  const [selectedMetric, setSelectedMetric] = useState(null); // Stores the currently selected metric
  const [selectedSchoolType, setSelectedSchoolType] = useState('all'); // Tracks the selected school type (e.g., High School)
  const [districtData, setDistrictData] = useState({}); // Holds the data for each school district
  const [maxValue, setMaxValue] = useState(null); // Stores the maximum value of the selected metric for color scaling
  const [geoJsonData, setGeoJsonData] = useState(null); // Stores the GeoJSON data used for rendering district shapes
  const [isMapReset, setIsMapReset] = useState(false); // Flag to reset the map rendering when certain changes occur
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  console.log("Backend URL: ", process.env.REACT_APP_BACKEND_URL);

  /**
   * Renders the geographical heatmap using D3.js.
   * Creates SVG elements, applies geographic projections, and handles color scaling
   * based on metric values.
   *
   * This function uses the following D3 functions:
   * - `d3.select()`: Selects the DOM element to attach SVG elements to.
   * - `d3.geoMercator()`: Geographic projection function to fit NYC into the heatmap size.
   * - `d3.geoPath()`: Converts GeoJSON data into SVG paths using the projection.
   * - `d3.scaleLinear()`: Creates a linear color scale based on the metric values.
   * - `svg.selectAll().data().enter()`: Binds GeoJSON data to SVG path elements and renders them.
   *
   * @internal
   */
  const drawMap = () => {
    const width = 700;
    const height = 580;

    // Ensure GeoJSON data is loaded before rendering the map
    if (!geoJsonData) {
      return;
    }

    // Clear any existing map SVG elements before rendering a new map
    d3.select('#map').selectAll('*').remove();

    // Create SVG container for the map
    const svg = d3.select('#map')
      .attr('width', width)
      .attr('height', height);

    // Create geographic projection to fit GeoJSON features to SVG dimensions
    const projection = d3.geoMercator().fitSize([width, height], geoJsonData);
    const path = d3.geoPath().projection(projection);

    // Create a color scale for the map based on metric values
    const colorScale = d3.scaleLinear()
      .domain([0, maxValue || 1])
      .range(["#e0f7fa", "#006064"]);

    // Render GeoJSON features as SVG paths
    svg.selectAll('path')
      .data(geoJsonData.features)
      .enter().append('path')
      .attr('d', path)
      .attr('fill', d => {
        const district = d.properties.school_dist;

        // Determine fill color based on the selected metric and district data
        if (selectedMetric && districtData && districtData.hasOwnProperty(district)) {
          const data = districtData[district];

          if (data === undefined || data === null) {
            return '#ccc'; // Grey color for districts without data
          }

          if (typeof data === 'number') {
            return colorScale(data); // Apply color scale for numeric data
          }
          if (data && typeof data === 'object' && data.hasOwnProperty('averageScore')) {
            return colorScale(data.averageScore); // Apply color scale for average scores
          }
          return '#ddd'; // Default color for other cases
        } else {
          return '#ccc'; // Grey color for districts without a selected metric
        }
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5)
      .on('mouseover', function (event, d) {
        const district = d.properties.school_dist;
        d3.select(this).attr('stroke-width', 2);

        // Prepare tooltip content with district details
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

        // Display tooltip near mouse cursor
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

    // Draw the legend if a metric is selected
    if (selectedMetric) {
      drawLegend(colorScale);
    }
  };

  /**
   * Creates a gradient legend for the heatmap using D3.js.
   * The legend shows the color scale range and corresponding metric values.
   *
   * This function uses the following D3 functions:
   * - `d3.select()`: Selects the DOM element for the legend.
   * - `svg.append()`: Appends SVG elements like rect and gradient definitions.
   * - `d3.scaleLinear()`: Creates a linear scale for the axis at the bottom of the legend.
   * - `d3.axisBottom()`: Creates an axis to display the range of the legend's color gradient.
   *
   * @param {d3.ScaleLinear} colorScale - The D3 color scale used in the heatmap
   * @internal
   */
  const drawLegend = (colorScale) => {
    const legendWidth = 300;
    const legendHeight = 20;
    const legendSvg = d3.select('#legend-gradient')
      .attr('width', legendWidth)
      .attr('height', legendHeight);

    // Remove any existing content in the legend
    legendSvg.selectAll("*").remove();

    // Define a linear gradient for the legend
    const defs = legendSvg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient');

    // Define gradient stops based on the color scale range
    linearGradient.selectAll('stop')
      .data(colorScale.range().map((color, i) => ({
        offset: i / (colorScale.range().length - 1),
        color
      })))
      .enter().append('stop')
      .attr('offset', d => d.offset * 100 + '%')
      .attr('stop-color', d => d.color);

    // Append a rectangle filled with the linear gradient
    legendSvg.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#linear-gradient)');

    // Create a scale and axis for the legend
    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale).ticks(5);
    legendSvg.append('g')
      .attr('transform', `translate(0, ${legendHeight})`)
      .call(legendAxis);
  };

  /**
   * Handles school type selection changes.
   * Triggers a reload of available metrics for the selected school type.
   *
   * @param {Event} event - The change event from the radio button
   * @internal
   */
  const handleSchoolTypeChange = (event) => {
    const newSchoolType = event.target.value;
    setSelectedSchoolType(newSchoolType);
  };

  // Effect to fetch available metrics when school type changes
  useEffect(() => {
    setSelectedMetric(null); // Reset the selected metric to ensure a fresh start
    setDistrictData({}); // Clear the district data as it's specific to the selected metric and school type
    setMaxValue(null); // Reset the maximum value used for color scaling, as it is metric-dependent
    setIsMapReset(true); // Trigger a flag to indicate the map needs to be redrawn due to changes
    d3.select('#map').selectAll('*').remove(); // Clear any existing elements in the map to prevent overlap

    // Fetch available metrics for the selected school type from the Flask backend
    // This backend call (`/metrics?schoolType`) is crucial to populate the dropdown with available metrics
    fetch(`${BACKEND_URL}/metrics?schoolType=${selectedSchoolType}`)
      .then(response => response.json())
      .then(data => {
        setMetrics(data.metrics); // Update the metrics dropdown options based on the selected school type
      })
      .catch(error => console.error("Error fetching metrics:", error));
  }, [selectedSchoolType]);
  // The dependency on `selectedSchoolType` ensures that this effect runs every time the school type is changed.
  // This is important to load the correct metrics for the chosen school type.

  // Effect to load GeoJSON data
  useEffect(() => {
    // Load GeoJSON data for NYC school districts
    // This data contains the geometric shapes of school districts which are visualized on the map
    fetch('/school_districts.geojson')
      .then(response => response.json())
      .then(data => {
        if (!data || !data.features) {
          console.error("Invalid GeoJSON data:", data);
          return;
        }
        setGeoJsonData(data); // Store the GeoJSON data for use in rendering the map
      })
      .catch(error => console.error("Error loading GeoJSON data:", error));
  }, []);
  // This effect runs only once when the component is mounted, ensuring that the GeoJSON data is fetched and stored.
  // The GeoJSON data remains constant and does not need to be refetched unless explicitly required.

  // Effect to reset map when school type changes or map needs redrawing
  useEffect(() => {
    if (isMapReset && geoJsonData) {
      drawMap(); // Redraw the map to reflect changes in the selected school type
      setIsMapReset(false); // Reset the flag to indicate the map has been successfully redrawn
    }
  }, [geoJsonData, isMapReset]);
  // This effect depends on `geoJsonData` and `isMapReset` to ensure that the map is redrawn only when
  // the data is available and the reset flag is true. This is useful for keeping the map updated
  // with new selections without redundant operations.

  // Effect to fetch district data when a metric is selected or the school type changes
  useEffect(() => {
    if (selectedMetric) {
      // Fetch district-level metric data from the Flask backend
      // This backend call (`/districts?metric&schoolType`) is necessary to get data for the selected metric
      fetch(`${BACKEND_URL}/districts?metric=${encodeURIComponent(selectedMetric)}&schoolType=${selectedSchoolType}`)
        .then(response => {
          if (!response.ok) throw new Error("Non-numeric data detected");
          return response.json();
        })
        .then(data => {
          if (!data || !data.districtAverages) {
            setDistrictData({}); // Clear the district data if no valid data is returned
          } else {
            setDistrictData(data.districtAverages); // Store the fetched district data to be visualized on the map
            drawMap(); // Redraw the map with the newly fetched district data
          }
        })
        .catch(error => {
          console.error("Error fetching district data:", error);
          setDistrictData({}); // Clear the district data in case of an error
        });

      // Fetch the maximum value for the selected metric from the backend
      // This call (`/max_value?metric&schoolType`) is used to determine the upper limit of the color scale
      fetch(`${BACKEND_URL}/districts?metric=${encodeURIComponent(selectedMetric)}&schoolType=${selectedSchoolType}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.maxValue) {
            setMaxValue(data.maxValue); // Update the max value for color scaling
          } else {
            setMaxValue(1); // Set a default max value if no data is found
          }
        })
        .catch(error => {
          console.error("Error fetching max value:", error);
          setMaxValue(1); // Set a default max value in case of an error
        });
    }
  }, [selectedMetric, selectedSchoolType]);
  // The dependencies on `selectedMetric` and `selectedSchoolType` ensure that this effect runs whenever
  // the metric or school type changes. This guarantees that the correct district data and color scaling
  // are applied for visualization.

  // Effect to redraw the map whenever relevant data changes
  useEffect(() => {
    if (geoJsonData && Object.keys(districtData).length > 0) {
      drawMap(); // Redraw the map when there is new GeoJSON data or district data available
    }
  }, [geoJsonData, districtData, maxValue, selectedMetric]);
  // This effect is triggered whenever `geoJsonData`, `districtData`, `maxValue`, or `selectedMetric` changes.
  // This ensures the map is updated with the latest data, keeping the visualization accurate.

  return (
    <div className="container mx-auto mt-6 p-4 bg-white rounded shadow flex flex-col items-center relative">
      <button
        onClick={() => window.location.href = '/'}
        className="back-arrow-btn"
        aria-label="Return to Home"
      >
        &larr;
      </button>
      <h1 className="text-xl font-bold mb-4">School Districts Map</h1>

      <div className="mb-4">
        <label className="ml-4">
          <input type="radio" value="all" checked={selectedSchoolType === 'all'} onChange={handleSchoolTypeChange} />
          All Schools
        </label>
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
