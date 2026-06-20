FROM python:3.11-slim

WORKDIR /app

COPY services/system-a-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/system-a-api /app

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
