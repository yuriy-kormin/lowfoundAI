#!/bin/bash

cd /app/
echo "Apply database migrations"
python manage.py migrate --noinput

echo "collect static"
python manage.py collectstatic --noinput

echo "Starting jango app"

gunicorn lowfoundAI.wsgi:application --bind 0.0.0.0:8000
