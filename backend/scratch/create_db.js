const mysql = require('mysql2/promise');

async function createDb() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  try {
    console.log('Creating database "yufeed"...');
    await connection.query('CREATE DATABASE IF NOT EXISTS yufeed');
    console.log('✅ Database "yufeed" created or already exists.');
  } catch (error) {
    console.error('❌ Error creating database:', error);
  } finally {
    await connection.end();
  }
}

createDb();
