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
  }
};
