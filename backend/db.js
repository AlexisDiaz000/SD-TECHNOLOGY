const { Pool } = require('pg');
require('dotenv').config();

/**
 * Singleton Pattern para la conexión a la base de datos
 * Garantiza una única instancia de conexión en toda la aplicación
 */
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    this.pool.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    this.pool.on('error', (err) => {
      console.error('❌ Unexpected error on idle client', err);
      process.exit(-1);
    });

    DatabaseConnection.instance = this;
  }

  getPool() {
    return this.pool;
  }

  async query(text, params) {
    return this.pool.query(text, params);
  }
}

// Exportar instancia única
const dbInstance = new DatabaseConnection();
module.exports = dbInstance;
