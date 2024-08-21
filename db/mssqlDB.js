const sql = require('mssql');

// Configuration object for the connection
const config = {
  user: process.env.MSSQL_DB_USER,
  password: process.env.MSSQL_DB_PASSWORD,
  server: process.env.MSSQL_DB_SERVER,
  database: process.env.MSSQL_DB_NAME,
  options: {
    encrypt: true, // Use encryption (depending on your setup)
    trustServerCertificate: true, // Required for self-signed certificates
  },
};

// Create and connect to MSSQL database
const connection = new sql.ConnectionPool(config);

connection.connect((err) => {
  if (err) {
    console.error('MSSQL Database connection failed: ', err);
  } else {
    console.log('MSSQL Database connected successfully');
  }
});

// Export the connection for use in other parts of the application
module.exports = connection;
