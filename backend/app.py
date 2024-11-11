from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Define paths for different school types
data_paths = {
    'hs': './data/final_combined_hs_data.csv',
    'ems': './data/final_combined_ems_data.csv',
    'hst': './data/final_combined_hst_data.csv',
    'd75': './data/final_combined_d75_data.csv',
    'ec': './data/final_combined_ec_data.csv'
}

# Load dataset based on school type
def load_dataset(school_type):
    data_path = data_paths.get(school_type)
    if not data_path or not os.path.exists(data_path):
        raise ValueError(f"Invalid school type or dataset not found for school type: {school_type}")
    return pd.read_csv(data_path)

@app.route('/')
def index():
    return "NYC Heatmap Backend API"

@app.route('/metrics', methods=['GET'])
def get_metrics():
    school_type = request.args.get('schoolType', 'hs')
    try:
        df = load_dataset(school_type)
        metrics = [col for col in df.columns if col not in ['DBN', 'Geographical_District_code']]
        return jsonify(metrics=metrics)
    except ValueError as e:
        return jsonify(error=str(e)), 400

@app.route('/districts', methods=['GET'])
def get_district_data():
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
    district_data = {}
    if "Rating" in metric:
        rating_mapping = {
            "Not Meeting Target": 0.0,
            "Approaching Target": 0.3,
            "Meeting Target": 0.7,
            "Exceeding Target": 1.0
        }
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
        for district, group in df[['Geographical_District_code', metric]].dropna().groupby('Geographical_District_code'):
            mapped_values = group[metric].map(quality_review_mapping).dropna().astype(float)
            frequency = group[metric].value_counts().to_dict()
            district_data[int(district)] = {
                "averageScore": mapped_values.mean() if not mapped_values.empty else None,
                "frequency": frequency
            }
    else:
        # For non-analytical categorical data, calculate frequency per district
        for district, group in df[['Geographical_District_code', metric]].dropna().groupby('Geographical_District_code'):
            frequency = group[metric].value_counts().to_dict()
            district_data[int(district)] = {
                "frequency": frequency
            }

    return jsonify(districtAverages=district_data)

@app.route('/max_value', methods=['GET'])
def get_max_value():
    school_type = request.args.get('schoolType', 'hs')
    metric = request.args.get('metric')
    try:
        df = load_dataset(school_type)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    if metric not in df.columns:
        return jsonify(error=f"Metric '{metric}' not found"), 400

    if pd.api.types.is_numeric_dtype(df[metric]):
        max_value = df[metric].max()
        return jsonify(maxValue=max_value)
    elif "Rating" in metric or "Quality Review" in metric:
        return jsonify(maxValue=1.0)  # For ratings and reviews, fixed at 1.0 based on our mappings
    else:
        return jsonify(maxValue=0)  # Default 0 for non-analytical non-numeric columns

@app.route('/geojson', methods=['GET'])
def get_geojson():
    geojson_path = './data/school_districts.geojson'
    return send_file(geojson_path, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, port=5004)
