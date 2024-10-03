#!/bin/bash
set -e

# Read secrets
MONGO_INITDB_ROOT_USERNAME=$(cat /run/secrets/db_root_username)
MONGO_INITDB_ROOT_PASSWORD=$(cat /run/secrets/db_root_password)
MONGO_INITDB_DATABASE=$(cat /run/secrets/db_name)
MONGO_INITDB_USER=$(cat /run/secrets/db_user)
MONGO_INITDB_PASSWORD=$(cat /run/secrets/db_password)

# Create root user
mongosh admin --eval "
  db.createUser({
    user: '$MONGO_INITDB_ROOT_USERNAME',
    pwd: '$MONGO_INITDB_ROOT_PASSWORD',
    roles: [ { role: 'root', db: 'admin' } ]
  })
"

# Create application user
mongosh $MONGO_INITDB_DATABASE --eval "
  db.createUser({
    user: '$MONGO_INITDB_USER',
    pwd: '$MONGO_INITDB_PASSWORD',
    roles: [ { role: 'readWrite', db: '$MONGO_INITDB_DATABASE' } ]
  })
"

echo "MongoDB users created."