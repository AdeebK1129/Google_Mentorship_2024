# Base Python Image
FROM python:3.9-slim AS backend

# Set the working directory for the backend
WORKDIR /app

# Copy the requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend/ .

# Expose the port that Flask listens on
EXPOSE 5004

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5004

# Run the Flask app using Gunicorn for production-level stability
CMD ["gunicorn", "--bind", "0.0.0.0:5004", "app:app"]
