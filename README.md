# Google_Mentorship_2024

# NYC School District Heatmap Visualization

## Overview
This project provides an interactive heatmap visualization of New York City school district data using survey metrics from the NYC Department of Education (NYCDOE). Users can select metrics to compare average school performance across different NYC districts, which are visualized through a dynamic map interface.

### Project Structure
- **backend**: A Flask API that serves the NYC school survey data. It provides endpoints for fetching survey metrics and calculating district averages.
- **frontend**: A React application that visualizes the data on an interactive map using D3.js.

## Purpose and Goals
The purpose of this project is to:
1. Visualize disparities in education metrics across NYC districts.
2. Provide an easy-to-use interface to explore and understand school performance data.
3. Allow users to interact with the map to see various metrics per district.

By displaying these metrics visually, the project aims to offer insights into educational quality, accessibility, and other performance indicators in different NYC districts.

---

## Getting Started

### Prerequisites
To set up and run the project locally, you’ll need:
- **Python 3.6+** and **pip**
- **Node.js** and **npm**
- **Git** for cloning the repository

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/nyc_school_heatmap.git
cd nyc_school_heatmap
