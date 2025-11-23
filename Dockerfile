# Stage 1: Build the React Frontend
FROM node:18-slim AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY kanban_board/frontend/package.json kanban_board/frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY kanban_board/frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Python Streamlit App
FROM python:3.9-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend assets from the builder stage
# We place them where the Python component expects them (kanban_board/frontend/dist)
COPY --from=frontend-builder /app/frontend/dist ./kanban_board/frontend/dist

# Copy the Python code
COPY kanban_board ./kanban_board
COPY app.py .

# Set environment variable to tell the component to use the built assets
ENV COMPONENT_READY=true

# Expose Streamlit port
EXPOSE 8501

# Run the app
CMD ["streamlit", "run", "app.py", "--server.address=0.0.0.0"]
