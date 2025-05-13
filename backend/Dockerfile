FROM python:3.11-slim

# Install system dependencies (including poppler)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy app code
COPY . .

# Expose port and run server
EXPOSE 10000
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "app:app"]

# Replace the old:
RUN pip install -r requirements.txt

# With this (명시적으로 최신 pip + OpenAI)
RUN pip install --upgrade pip && pip uninstall -y openai && pip install openai==1.3.7 && pip install -r requirements.txt

