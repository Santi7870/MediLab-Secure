FROM python:3.11-slim

WORKDIR /app

COPY services/system-b-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/system-b-api /app

EXPOSE 8002

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
