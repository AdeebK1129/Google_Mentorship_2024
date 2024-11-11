# Frontend Stage
FROM node:16 AS frontend

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend code into the container
COPY frontend/ .

# Install dependencies and build the frontend for production
RUN npm install && npm run build

# Backend Stage
FROM python:3.9-slim AS backend

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy the backend code into the container
COPY backend/ .

# Install a simple server for serving the frontend and proxying requests
RUN pip install flask-cors gunicorn

# Copy frontend build files from the frontend stage to the backend stage
COPY --from=frontend /app/frontend/build /app/frontend_build

# Expose the port that Flask listens on
EXPOSE 5004

# Create a simple proxy to route frontend and backend requests using Flask
RUN echo '#!/bin/bash\n gunicorn --chdir /app/backend app:app --bind 0.0.0.0:5004' > /app/backend/start.sh

# Make the start script executable
RUN chmod +x /app/backend/start.sh

# Run the start script
CMD ["/app/backend/start.sh"]
