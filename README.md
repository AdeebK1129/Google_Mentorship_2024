# NYC School District Heatmap

---

## Project Overview
The NYC School District Heatmap is a data visualization project designed to illustrate and compare school quality metrics across various districts in New York City. By utilizing 2023 survey data and geographical district information, this project provides an interactive map, enabling users to explore educational disparities across school districts.

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
```

#### 2. Set Up the Backend
1. Navigate to the `backend` directory:
```bash
cd backend
```

2. Create a virtual environment (optional but recommended):
```bash
python3 -m venv venv  
source venv/bin/activate  # On Windows, use venv\\Scripts\\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt  
```

4. Start the Flask server:
```bash  
python app.py
```

The Flask API should now be running at `http://127.0.0.1:5000`.

#### 3. Set Up the Frontend
1. Navigate to the `frontend` directory:
```bash 
cd ../frontend
```

3. Install dependencies:
```bash
npm install
``` 

5. Start the React development server:
```bash 
npm start
```  

The React app should now be running at `http://localhost:3000` and will automatically connect to the Flask backend.

---

## Project Structure

- **backend/**: Contains the Flask backend application.
  - `app.py`: Main Flask application that serves as the API endpoint for the React frontend.
  - `final_combined_data.csv`: The dataset containing school quality metrics and district information.
  - `requirements.txt`: Python dependencies for the backend.

- **frontend/**: Contains the React frontend application.
  - `src/`: Main source folder for React components and logic.
  - `public/`: Contains static files including `index.html`.
  - `package.json`: Node.js dependencies for the frontend.

---

## Usage

1. After setting up both the backend and frontend, open a web browser and go to `http://localhost:3000`.
2. Select a metric from the dropdown to visualize various school district metrics on the map.
3. Hover over a district to see average values for that district’s selected metric.

---

## API Endpoints

The Flask backend provides the following endpoints:

- **GET /metrics**  
Returns the list of available metrics.

- **GET /districts/<metric>**  
Returns the average value of the specified metric for each district.

---

## Technologies Used

- **Frontend**: React, D3.js for data visualization
- **Backend**: Flask, Pandas
- **Data Source**: NYC Department of Education 2023 Survey Data
