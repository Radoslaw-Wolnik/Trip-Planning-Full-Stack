print('Starting MongoDB initialization script');

// Use environment variables for MongoDB initialization
db = db.getSiblingDB('admin');

try {
  const rootUserResult = db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [{ role: 'root', db: 'admin' }]
  });
  print('Root user creation result:', rootUserResult);
  if (rootUserResult.ok) {
    print('Root user created successfully');
  } else {
    print('Failed to create root user');
  }
} catch (error) {
  print('Error creating root user:', error.message);
}

// Create the application user for a specific database
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

try {
  const appUserResult = db.createUser({
    user: process.env.MONGO_INITDB_USER,
    pwd: process.env.MONGO_INITDB_PASSWORD,
    roles: [{ role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE }]
  });
  print('Application user creation result:', appUserResult);
  if (appUserResult.ok) {
    print('Application user created successfully');
  } else {
    print('Failed to create application user');
  }
} catch (error) {
  print('Error creating application user:', error.message);
}
