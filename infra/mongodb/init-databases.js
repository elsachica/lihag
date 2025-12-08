db = db.getSiblingDB('admin');
db.auth('admin', 'password');

// Property Database
db = db.getSiblingDB('propertyDB');
db.createUser({
  user: 'property_user',
  pwd: 'property_password',
  roles: [{role: 'readWrite', db: 'propertyDB'}]
});

// Auth Database (för senare)
db = db.getSiblingDB('authDB');
db.createUser({
  user: 'auth_user',
  pwd: 'auth_password',
  roles: [{role: 'readWrite', db: 'authDB'}]
});

// Maintenance Database (för senare)
db = db.getSiblingDB('maintenanceDB');
db.createUser({
  user: 'maintenance_user',
  pwd: 'maintenance_password',
  roles: [{role: 'readWrite', db: 'maintenanceDB'}]
});

print('✓ All databases and users initialized successfully');
