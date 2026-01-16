
// // config/db.js
// const mysql = require('mysql2');

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Rutik@8857', // Make sure this is your correct password
//   database: 'garage', // <-- 1. This MUST match your schema name
//   // waitForConnections: true,
//   // connectionLimit: 10, 
//   // queueLimit: 0
// });



// module.exports = db.promise();




/* 
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Rutik@8857',
  database: process.env.DB_NAME || 'garage',
  port: process.env.DB_PORT || 3306,
 
});

module.exports = db.promise();  */






const mysql = require('mysql2');

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('Error: DB_USER and DB_PASSWORD must be set in environment variables.');
}

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'garage',
  port: process.env.DB_PORT || 3306,
 
});

module.exports = db.promise();