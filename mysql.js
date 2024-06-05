

// mysql2 package is a MySQL client for Node.js 
// provides support for interacting with MySQL databases asynchronously using promises
const mysql = require('mysql2/promise')

// require this because it get the data out of .env file
const dotenv = require('dotenv');
dotenv.config();


const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD, 
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed - how many connections are allowed simultaneously
    queueLimit: 0
});


module.exports = pool;