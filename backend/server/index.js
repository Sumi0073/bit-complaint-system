import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5432;

// Allow all origins in production since frontend URL might vary
app.use(cors());
app.use(express.json());

const rateLimit = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, firstRequest: now });
    return next();
  }

  const data = rateLimit.get(ip);
  if (now - data.firstRequest > WINDOW_MS) {
    data.count = 1;
    data.firstRequest = now;
    return next();
  }

  if (data.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  data.count++;
  next();
};

app.use(rateLimiter);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const userResult = await query(
      'SELECT email FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!userResult.rows.length || userResult.rows[0].email !== 'admin@bitmesra.ac.in') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking admin status' });
  }
};

app.post('/api/auth/signup', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password, name, phone, designation, employee_id, address, securityQuestion, securityAnswer } = req.body;
    
    const userExists = await client.query(
      'SELECT * FROM users WHERE email = $1 OR employee_id = $2',
      [email, employee_id]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email or employee ID' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await client.query(
      `INSERT INTO users (
        email, password_hash, name, phone, designation, 
        employee_id, address, security_question, security_answer
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, email, name, phone, designation, employee_id, address`,
      [email, hashedPassword, name, phone, designation, employee_id, address, securityQuestion, securityAnswer.toLowerCase()]
    );

    const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_SECRET);
    res.json({ user: result.rows[0], token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user account' });
  } finally {
    client.release();
  }
});

app.post('/api/auth/login', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;
    
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, result.rows[0].password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password_hash, security_question, security_answer, ...user } = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  } finally {
    client.release();
  }
});

app.post('/api/auth/verify-security', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, securityAnswer } = req.body;
    
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1 AND LOWER(security_answer) = LOWER($2)',
      [email, securityAnswer]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid security answer' });
    }

    res.json({ verified: true });
  } catch (error) {
    console.error('Security verification error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, newPassword } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email, name, designation',
      [hashedPassword, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.post('/api/complaints', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { type, category, urgency, description, location, preferred_timing, material_provided } = req.body;
    
    const result = await client.query(
      `INSERT INTO complaints (
        user_id, type, category, urgency, description, location, 
        preferred_timing, material_provided
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [req.user.id, type, category, urgency, description, location, preferred_timing, material_provided]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.get('/api/complaints', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT c.*, u.name as user_name, u.email as user_email 
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.get('/api/complaints/admin', authenticateToken, isAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT c.*, u.name as user_name, u.email as user_email,
       u.phone as user_phone, u.designation as user_designation,
       u.employee_id as user_id, u.address as user_address
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get admin complaints error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.patch('/api/complaints/:id/status', authenticateToken, isAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const { status, rejection_reason } = req.body;
    
    const result = await client.query(
      `UPDATE complaints 
       SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, rejection_reason, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  pool.end(() => {
    console.log('Database pool has ended');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
