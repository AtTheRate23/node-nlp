// database.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'oakter.cuzlniri5zxa.ap-south-1.rds.amazonaws.com',
  user: 'root',
  password: 'poiuytrewq',
  database: 'voice_bot'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = connection;