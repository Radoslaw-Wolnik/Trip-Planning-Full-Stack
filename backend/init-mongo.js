// Use environment variables for MongoDB initialization
db = db.getSiblingDB('admin');
db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [{ role: 'root', db: 'admin' }]
});

// Create the application user for a specific database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createUser({
  user: process.env.MONGO_INITDB_USER,
  pwd: process.env.MONGO_INITDB_PASSWORD,
  roles: [{ role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE }]
});
