GRIP Invest - Investment Management Platform
A comprehensive investment management platform built with Node.js, React, and MySQL, featuring AI-powered recommendations, portfolio tracking, and transaction monitoring.

🚀 Features
User Authentication & Authorization – Secure JWT-based authentication with role-based access
Investment Products Management – Support for Bonds, Fixed Deposits, Mutual Funds, ETFs
Portfolio Tracking – Real-time portfolio monitoring with risk distribution analysis
AI-Powered Recommendations – Personalized investment suggestions based on risk appetite
Transaction Logging – Comprehensive audit trail for all monetary transactions
Admin Dashboard – Complete administrative control over products and users
Health Monitoring – Built-in health checks and monitoring endpoints
Docker Support – Full containerization with docker-compose for easy deployment
🏗️ Architecture
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │ Frontend │ │ Backend │ │ Database │ │ (React) │◄──►│ (Node.js) │◄──►│ (MySQL) │ │ Port: 3000 │ │ Port: 5000 │ │ Port: 3307 │ └─────────────────┘ └─────────────────┘ └─────────────────┘

📋 Prerequisites
Docker & Docker Compose
Node.js 20+ (for local development)
MySQL 8.0+ (for local development)
🐳 Quick Start with Docker
1. Clone the Repository
```bash git clone cd gripinvest 2. Start All Services bash Copy code docker-compose up --build This will start:

Backend API on http://localhost:5000

Frontend on http://localhost:3000

MySQL Database on localhost:3307

Redis (optional) on localhost:6379

Verify Installation bash Copy code
Check backend health
curl http://localhost:5000/api/health

Check frontend
curl http://localhost:3000/health 4. Access the Application Frontend: http://localhost:3000

Backend API: http://localhost:5000

🔧 Local Development Setup Backend bash Copy code cd backend npm install npm start Frontend bash Copy code cd frontend npm install npm start Database bash Copy code

Connect to database
mysql -u root -p CREATE DATABASE gripinvest;

Run migrations and seed data
mysql -u root -p gripinvest < backend/seed.sql mysql -u root -p gripinvest < backend/migration.sql 📊 Database Schema Core Tables users – User accounts with balance and risk appetite

investment_products – Available investment options

investments – User investment records

transaction_logs – Audit trail for all transactions

password_resets – OTP-based password reset

Sample Data Admin user: admin@example.com / admin123

Demo users with different risk profiles

Sample investment products (Bonds, FDs, Mutual Funds, ETFs)

🔐 Authentication Default Credentials Admin: admin@example.com / admin123

User: user@example.com / password123

JWT Configuration Secret: supersecret_jwt_key_for_production

Expiry: 24 hours

Algorithm: HS256

📡 API Endpoints Authentication POST /api/auth/register – User registration

POST /api/auth/login – User login

POST /api/auth/forgot-password – Password reset request

POST /api/auth/reset-password – Password reset confirmation

Products GET /api/products – List all products

GET /api/products/recommendations – Get AI recommendations

POST /api/products – Create new product (Admin only)

PUT /api/products/:id – Update product (Admin only)

DELETE /api/products/:id – Delete product (Admin only)

Investments POST /api/investments – Make investment

GET /api/investments/portfolio/:userId – Get user portfolio

Admin GET /api/admin/users – List all users

GET /api/admin/investments – Monitor all investments

GET /api/admin/products – Manage products

Health & Monitoring GET /api/health – Comprehensive health check

GET /api/ready – Readiness probe

GET /api/live – Liveness probe

🏥 Health Monitoring bash Copy code

Comprehensive health check
curl http://localhost:5000/api/health

Readiness probe
curl http://localhost:5000/api/ready

Liveness probe
curl http://localhost:5000/api/live 📝 Logging Location: backend/logs/

Format: JSON structured logs

Rotation: Daily log files

Levels: info, warn, error

json Copy code { "timestamp": "2024-01-15T10:30:00.000Z", "level": "info", "message": "Request completed", "method": "POST", "url": "/api/investments", "statusCode": 201, "duration": "150ms", "userId": "user-123" } 🧪 Testing Postman collection included (postman/GRIP_Invest_API.postman_collection.json)

Manual testing example:

bash Copy code curl -X POST http://localhost:5000/api/auth/register
-H "Content-Type: application/json"
-d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"password123"}' 🔧 Configuration bash Copy code

Environment Variables
DB_HOST=db DB_USER=root DB_PASSWORD=root DB_NAME=gripinvest DB_PORT=3306 JWT_SECRET=supersecret_jwt_key_for_production NODE_ENV=production LOG_LEVEL=info ADMIN_EMAIL=admin@example.com REACT_APP_API_URL=http://localhost:5000 REACT_APP_ENV=production 🚀 Deployment bash Copy code docker-compose -f docker-compose.yml up --build -d docker-compose ps docker-compose logs -f Scaling bash Copy code docker-compose up --scale backend=3 docker-compose -f docker-compose.prod.yml up 🛠️ Development Commands bash Copy code

Backend
cd backend npm install npm start npm run dev npm test

Frontend
cd frontend npm install npm start npm run build npm test 🔒 Security Features JWT Authentication

Password Hashing (bcrypt)

Input Validation & Sanitization

CORS Configuration

SQL Injection Protection

Rate Limiting

🤖 AI Features Risk-based product recommendations

Portfolio analysis & risk distribution

Personalized suggestions

Future: Market analysis, predictive analytics, chatbot support, fraud detection

🐛 Troubleshooting Database connection, frontend/backend errors, performance issues covered with Docker commands and logs

🤝 Contributing Fork repository

Create feature branch

Implement changes & add tests

Submit pull request

📄 License MIT License – see LICENSE file for details

📞 Support Email: support@gripinvest.com

Issues: GitHub Issues

Documentation: http://localhost:5000
