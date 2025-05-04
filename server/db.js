import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    done();
  }
});

// Initialize database tables
const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create users table with security question fields
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        designation VARCHAR(50),
        employee_id VARCHAR(50) UNIQUE,
        address TEXT,
        security_question VARCHAR(100),
        security_answer VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create complaints table
    await client.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        urgency VARCHAR(20) NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        preferred_timing TIME,
        material_provided BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'new',
        rejection_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if admin user exists
    const adminExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@bitmesra.ac.in']
    );

    // Create or update admin user
    if (adminExists.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);

      await client.query(
        `INSERT INTO users (
          email, password_hash, name, designation, employee_id,
          security_question, security_answer
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          'admin@bitmesra.ac.in',
          hashedPassword,
          'Admin User',
          'staff',
          'ADMIN001',
          'lastName',
          'admin'
        ]
      );
      console.log('Admin user created successfully');
    }

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
};

// Initialize database
initDb().catch(console.error);

export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getClient = async () => {
  return await pool.connect();
};

export { pool };