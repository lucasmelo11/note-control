#!/bin/sh

python manage.py migrate --noinput

echo "from django.contrib.auth import get_user_model; \
User = get_user_model(); \
User.objects.filter(username='admin').exists() or \
User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" | python manage.py shell

gunicorn backend.wsgi:application --bind 0.0.0.0:8000