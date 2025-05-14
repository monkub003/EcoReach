#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready..."
python << END
import sys
import time
import psycopg2
import os
from urllib.parse import urlparse

suggest_unrecoverable_after = 30
start = time.time()

database_url = os.environ.get('DATABASE_URL', '')
if not database_url:
    sys.stderr.write("DATABASE_URL environment variable is not set!\n")
    sys.exit(1)

# Parse the DATABASE_URL
url = urlparse(database_url)
dbname = url.path[1:]
user = url.username
password = url.password
host = url.hostname
port = url.port or 5432

while True:
    try:
        psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port,
        )
        break
    except psycopg2.OperationalError as error:
        sys.stderr.write("Waiting for PostgreSQL to become available...\n")

        if time.time() - start > suggest_unrecoverable_after:
            sys.stderr.write("  This is taking longer than expected. The following exception may be indicative of an unrecoverable error: '{}'\n".format(error))

    time.sleep(1)
END

# Run migrations
python manage.py migrate

# Load initial data
python manage.py loaddata products.json users.json || echo "Could not load fixtures" 