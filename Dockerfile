# Use a slim Python image (small & fast)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

RUN pip install --no-cache-dir \
    flask \
    flask-sqlalchemy \
    flask-cors \
    flask-jwt-extended \
    flask-smorest \
    flask-limiter \
    python-dotenv
# Copy the rest of your application code
COPY backend/ .

# Expose the port Flask will run on (default is 5000)
EXPOSE 5000

# Run the Flask application

CMD ["python", "app.py"]
