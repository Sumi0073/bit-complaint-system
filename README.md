# BIT Mesra Electric Office Complaint System

A web-based complaint management system for BIT Mesra's Electric Office, built with React, Node.js, and PostgreSQL.

## Features

- User Authentication with JWT
- Role-based Access Control (Admin/User)
- Complaint Submission and Tracking
- Admin Dashboard for Complaint Management
- Real-time Status Updates
- Responsive Design

## Project Structure

```
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
└── README.md         # Project documentation
```

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bit-complaint-system.git
   cd bit-complaint-system
   ```

2. Install dependencies:
   ```bash
   # Install all dependencies
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Copy contents from respective `.env.example` files
   - Update with your configuration

4. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_USER=postgres
DB_HOST=localhost
DB_NAME=complaints_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secure_jwt_secret_key
```

## Database Setup

1. Create a PostgreSQL database
2. Update backend `.env` with database credentials
3. Tables will be automatically created on first run

## Deployment

The application is deployed on Render:
- Frontend: [https://bit-complaint-frontend.onrender.com](https://bit-complaint-frontend.onrender.com)
- Backend: [https://bit-complaint-api.onrender.com](https://bit-complaint-api.onrender.com)

## License

MIT License