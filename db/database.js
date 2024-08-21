// database.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('SQL Database connection failed: ', err);
  } else {
    console.log('SQL Database connected successfully');
  }
});

module.exports = connection;