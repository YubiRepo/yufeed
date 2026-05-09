const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'feedid',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDb() {
  const connection = await pool.getConnection();
  try {
    // Sources Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sources (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        baseUrl TEXT NOT NULL,
        categories JSON NOT NULL,
        selectors JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        api_key VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  initDb,
  // CRUD operations
  async getAllSources() {
    const [rows] = await pool.query('SELECT * FROM sources ORDER BY name ASC');
    return rows;
  },
  async getSourceById(id) {
    const [rows] = await pool.query('SELECT * FROM sources WHERE id = ?', [id]);
    return rows[0];
  },
  async upsertSource(id, name, baseUrl, categories, selectors) {
    const [rows] = await pool.query(
      'INSERT INTO sources (id, name, baseUrl, categories, selectors) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, baseUrl=?, categories=?, selectors=?',
      [id, name, baseUrl, JSON.stringify(categories), JSON.stringify(selectors), name, baseUrl, JSON.stringify(categories), JSON.stringify(selectors)]
    );
    return rows;
  },
  async deleteSource(id) {
    const [rows] = await pool.query('DELETE FROM sources WHERE id = ?', [id]);
    return rows;
  },
  // User & API Key Operations
  async getUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
  async getUserByApiKey(apiKey) {
    const [rows] = await pool.query('SELECT * FROM users WHERE api_key = ?', [apiKey]);
    return rows[0];
  },
  async createUser(username, hashedPassword, apiKey, role = 'user') {
    const [rows] = await pool.query(
      'INSERT INTO users (username, password, api_key, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, apiKey, role]
    );
    return rows;
  },
  async updateApiKey(userId, newApiKey) {
    const [rows] = await pool.query('UPDATE users SET api_key = ? WHERE id = ?', [newApiKey, userId]);
    return rows;
  }
};
