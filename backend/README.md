# BIT Mesra Electric Office Complaint System - Backend

This is the backend server for the BIT Mesra Electric Office Complaint System. It's built with Node.js, Express, and PostgreSQL.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

See `.env.example` for required environment variables.

## API Documentation

### Authentication
- POST `/api/auth/signup`: Create new user account
- POST `/api/auth/login`: User login
- POST `/api/auth/verify-security`: Verify security question
- POST `/api/auth/reset-password`: Reset password

### Complaints
- POST `/api/complaints`: Create new complaint
- GET `/api/complaints`: Get user's complaints
- GET `/api/complaints/admin`: Get all complaints (admin only)
- PATCH `/api/complaints/:id/status`: Update complaint status