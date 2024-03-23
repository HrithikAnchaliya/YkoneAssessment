// db.js

const mysql = require('mysql2');
const  { createIndexInElasticsearch } = require("../controllers/elasticController");
require('dotenv').config(); // Load environment variables from .env file if used

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  createIndexInElasticsearch().then( () => {
        console.log("Elasticsearch Connected Successfully");
  });

});

module.exports = connection;