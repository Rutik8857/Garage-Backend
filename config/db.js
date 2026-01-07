// // config/db.js
// const mysql = require('mysql2');

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'you_learn'
//   // ... other settings
// });

// console.log('Successfully connected to the database.');

// module.exports = db.promise(); // Use promises for modern async/await syntax

// config/db.js
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Rutik@8857', // Make sure this is your correct password
  database: 'garage', // <-- 1. This MUST match your schema name
  // waitForConnections: true,
  // connectionLimit: 10, 
  // queueLimit: 0
});

// 2. We remove the console.log() from here.
// The connection will be tested when you start your server
// or when the first database query is made.

module.exports = db.promise();