from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load the dataset
data_path = './data/final_combined_data.csv'
df = pd.read_csv(data_path)

@app.route('/')
def index():
    return "NYC Heatmap Backend API"

@app.route('/metrics', methods=['GET'])
def get_metrics():
    metrics = [col for col in df.columns if col not in ['DBN', 'Geographical_District_code']]
    return jsonify(metrics=metrics)

@app.route('/districts', methods=['GET'])
def get_district_data():
    metric = request.args.get('metric')
    if metric not in df.columns:
        return jsonify(error=f"Metric '{metric}' not found"), 400
    
    if pd.api.types.is_numeric_dtype(df[metric]):
        # Numeric data: calculate average per district
        district_data = df.groupby('Geographical_District_code')[metric].mean().to_dict()
        sorted_district_data = {int(k): v for k, v in sorted(district_data.items())}
        return jsonify(districtAverages=sorted_district_data)
    else:
        # Categorical data: calculate frequency per district
        district_data = {}
        for district, group in df[['Geographical_District_code', metric]].dropna().groupby('Geographical_District_code'):
            frequency = group[metric].value_counts().to_dict()
            district_data[int(district)] = frequency
        return jsonify(districtAverages=district_data)

@app.route('/max_value', methods=['GET'])
def get_max_value():
    metric = request.args.get('metric')
    if metric not in df.columns:
        return jsonify(error=f"Metric '{metric}' not found"), 400

    if pd.api.types.is_numeric_dtype(df[metric]):
        max_value = df[metric].max()
        return jsonify(maxValue=max_value)
    else:
        return jsonify(maxValue=None)  # No max value for non-numeric metrics

@app.route('/geojson', methods=['GET'])
def get_geojson():
    geojson_path = './data/school_districts.geojson'
    return send_file(geojson_path, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, port=5004)
