FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies if needed (none strictly required for this static site + script, but good practice)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the simple HTTP server
CMD ["python3", "-m", "http.server", "8080", "--bind", "0.0.0.0"]
