from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

# Initialize Flask app, setting static_folder to point to frontend build
app = Flask(__name__, static_folder="../frontend/build", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}})

# Define paths for datasets based on school type
# Each key corresponds to a type of school, and the value is the file path to the dataset
# hs = High Schools, ems = Elementary/Middle Schools, hst = High School Transfer, d75 = District 75, ec = Early Childhood
# This allows us to load different datasets dynamically depending on the request
data_paths = {
    'hs': './data/final_combined_hs_data.csv',
    'ems': './data/final_combined_ems_data.csv',
    'hst': './data/final_combined_hst_data.csv',
    'd75': './data/final_combined_d75_data.csv',
    'ec': './data/final_combined_ec_data.csv'
}

# Function to load the appropriate dataset based on the school type provided
# Args:
#   school_type (str): The type of school, which determines which dataset to load
# Returns:
#   pd.DataFrame: A pandas DataFrame loaded with the specified dataset
# Raises:
#   ValueError: If the specified school type is invalid or the dataset does not exist
# This function ensures that we only load existing and valid datasets
# It is used by the API routes to ensure correct data handling based on the user's request
def load_dataset(school_type):
    """
    Load the dataset for the specified school type.

    Args:
        school_type (str): The type of school, which determines which dataset to load.

    Returns:
        pd.DataFrame: A pandas DataFrame loaded with the specified dataset.

    Raises:
        ValueError: If the specified school type is invalid or the dataset does not exist.
    """
    data_path = data_paths.get(school_type)
    if not data_path or not os.path.exists(data_path):
        raise ValueError(f"Invalid school type or dataset not found for school type: {school_type}")
    return pd.read_csv(data_path)

# Serve React frontend for all other routes
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """
    Serve the React app for all unknown routes. 
    This lets React Router handle the routing client-side.
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # Serve index.html for any route not found in Flask, to let React Router take over
        return send_from_directory(app.static_folder, "index.html")

# Add your existing API routes here (e.g., /metrics, /districts, etc.)

# Route to retrieve available metrics from the dataset
# Endpoint: /metrics
# Method: GET
# Args:
#   schoolType (str): The type of school dataset to query. Default is 'hs'.
# Returns:
#   List of column names (metrics) from the dataset, excluding DBN and Geographical_District_code
# This route enables users to see all metrics they can query for a given school type
@app.route('/metrics', methods=['GET'])
def get_metrics():
    """
    Retrieve available metrics from the dataset.

    Args:
        schoolType (str): The type of school dataset to query. Default is 'hs'.

    Returns:
        Response: A JSON response containing a list of metrics available in the dataset.

    Usage in HeatMap.jsx:
        This route is used in HeatMap.jsx to populate the dropdown menu with the available metrics.
        It allows users to select which metric they want to visualize on the heatmap, helping customize the data displayed.
    """
    school_type = request.args.get('schoolType', 'hs')
    try:
        df = load_dataset(school_type)
        # Exclude columns that are not metrics, such as identifiers
        metrics = [col for col in df.columns if col not in ['DBN', 'Geographical_District_code']]
        return jsonify(metrics=metrics)
    except ValueError as e:
        return jsonify(error=str(e)), 400

# Route to retrieve aggregated data for each district based on a specific metric
# Endpoint: /districts
# Method: GET
# Args:
#   schoolType (str): The type of school dataset to query. Default is 'hs'.
#   metric (str): The metric to calculate the average or frequency data for each district.
# Returns:
#   Aggregated data for each district, including average scores or frequency counts depending on the type of metric
@app.route('/districts', methods=['GET'])
def get_district_data():
    """
    Retrieve aggregated data for each district based on a specific metric.

    Args:
        schoolType (str): The type of school dataset to query. Default is 'hs'.
        metric (str): The metric to calculate the average or frequency data for each district.

    Returns:
        Response: A JSON response containing aggregated data for each district.

    Usage in HeatMap.jsx:
        This route is used to fetch the data required to color each district on the heatmap based on the selected metric.
        The data helps determine the color intensity for each district, thereby visualizing differences across metrics like performance or ratings.
    """
    school_type = request.args.get('schoolType', 'hs')
    metric = request.args.get('metric')
    try:
        df = load_dataset(school_type)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    if metric not in df.columns:
        return jsonify(error=f"Metric '{metric}' not found"), 400

    # Handle numeric data by calculating the average per district
    if pd.api.types.is_numeric_dtype(df[metric]):
        district_data = df.groupby('Geographical_District_code')[metric].mean().to_dict()
        sorted_district_data = {int(k): v for k, v in sorted(district_data.items())}
        return jsonify(districtAverages=sorted_district_data)

    # Handle categorical data with specific mappings
    # This section calculates scores and frequencies for categorical metrics with specific mappings like 'Rating' or 'Quality Review'
    district_data = {}
    if "Rating" in metric:
        rating_mapping = {
            "Not Meeting Target": 0.0,
            "Approaching Target": 0.3,
            "Meeting Target": 0.7,
            "Exceeding Target": 1.0
        }
        # Group data by district and map the ratings to numerical values for aggregation
        for district, group in df[['Geographical_District_code', metric]].dropna().groupby('Geographical_District_code'):
            mapped_values = group[metric].map(rating_mapping).dropna().astype(float)
            frequency = group[metric].value_counts().to_dict()
            district_data[int(district)] = {
                "averageScore": mapped_values.mean() if not mapped_values.empty else None,
                "frequency": frequency
            }

    elif "Quality Review" in metric:
        quality_review_mapping = {
            "Under Developed": 0.0,
            "Developing": 0.3,
            "Proficient": 0.7,
            "Well Developed": 1.0
        }
        # Group data by district and map the quality review ratings to numerical values for aggregation
        for district, group in df[['Geographical_District_code', metric]].dropna().groupby('Geographical_District_code'):
            mapped_values = group[metric].map(quality_review_mapping).dropna().astype(float)
            frequency = group[metric].value_counts().to_dict()
            district_data[int(district)] = {
                "averageScore": mapped_values.mean() if not mapped_values.empty else None,
                "frequency": frequency
            }
    else:
        # For non-analytical categorical data, calculate frequency per district
        # For metrics that do not have numerical or rating-based mappings, the frequency count is provided
        for district, group in df[['Geographical_District_code', metric]].dropna().groupby('Geographical_District_code'):
            frequency = group[metric].value_counts().to_dict()
            district_data[int(district)] = {
                "frequency": frequency
            }

    return jsonify(districtAverages=district_data)

# Route to get the maximum value of a specified metric
# Endpoint: /max_value
# Method: GET
# Args:
#   schoolType (str): The type of school dataset to query. Default is 'hs'.
#   metric (str): The metric to find the maximum value for.
# Returns:
#   The maximum value of the specified metric, which can be used for scaling in visualizations
@app.route('/max_value', methods=['GET'])
def get_max_value():
    """
    Get the maximum value of a specified metric.

    Args:
        schoolType (str): The type of school dataset to query. Default is 'hs'.
        metric (str): The metric to find the maximum value for.

    Returns:
        Response: A JSON response containing the maximum value of the specified metric.

    Usage in HeatMap.jsx:
        This route is used to determine the scaling factor for the heatmap color legend.
        It helps in setting the color scale appropriately to reflect the range of values for the selected metric, ensuring that visual representation is accurate.
    """
    school_type = request.args.get('schoolType', 'hs')
    metric = request.args.get('metric')
    try:
        df = load_dataset(school_type)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    if metric not in df.columns:
        return jsonify(error=f"Metric '{metric}' not found"), 400

    # Handle numeric metrics by finding the maximum value in the column
    if pd.api.types.is_numeric_dtype(df[metric]):
        max_value = df[metric].max()
        return jsonify(maxValue=max_value)
    elif "Rating" in metric or "Quality Review" in metric:
        # For ratings and quality reviews, the maximum value is always 1.0 due to the defined mapping
        return jsonify(maxValue=1.0)
    else:
        # Default max value for non-numeric and non-rating metrics
        return jsonify(maxValue=0)

# Route to serve GeoJSON data for visualizing school districts on a map
# Endpoint: /geojson
# Method: GET
# Returns:
#   The GeoJSON file containing geographical data for NYC school districts
# This endpoint serves the GeoJSON file to enable frontend visualizations using map libraries
@app.route('/geojson', methods=['GET'])
def get_geojson():
    """
    Serve GeoJSON data for visualizing school districts on a map.

    Returns:
        Response: The GeoJSON file containing geographical data for NYC school districts.

    Usage in HeatMap.jsx:
        This route is used in HeatMap.jsx to draw the school district boundaries on the map.
        It allows the visualization of school district areas so that metric data can be overlaid, providing context to the heatmap visualization.
    """
    geojson_path = './data/school_districts.geojson'
    return send_file(geojson_path, mimetype='application/json')

# Run the application in debug mode for development purposes
# The server will run on port 5004
if __name__ == '__main__':
    app.run(debug=True, port=5004)
