// test-mysql.js
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: null,
      database: 'dicedreams'
    });
    console.log('Connection successful');
    await connection.end();
  } catch (error) {
    console.error('Error connecting:', error);
  }
}

testConnection();
