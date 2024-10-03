#!/bin/bash
set -e

# Use environment variables directly
MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE}
MONGO_INITDB_USER=${DB_USER}
MONGO_INITDB_PASSWORD=${DB_PASSWORD}

# Check if initialization has already been performed
if [ -e "/data/db/.mongodb_initialized" ]; then
    echo "MongoDB has already been initialized. Skipping initialization."
    exit 0
fi

echo "Initializing MongoDB..."

# Create root user
echo "Creating root user..."
mongosh admin --eval "
  db.createUser({
    user: '$MONGO_INITDB_ROOT_USERNAME',
    pwd: '$MONGO_INITDB_ROOT_PASSWORD',
    roles: [ { role: 'root', db: 'admin' } ]
  })
"

# Create application user
echo "Creating application user..."
mongosh $MONGO_INITDB_DATABASE --eval "
  db.createUser({
    user: '$MONGO_INITDB_USER',
    pwd: '$MONGO_INITDB_PASSWORD',
    roles: [ { role: 'readWrite', db: '$MONGO_INITDB_DATABASE' } ]
  })
"

# Create a file to indicate that initialization has been performed
touch /data/db/.mongodb_initialized

echo "MongoDB initialization completed."
