# 💰 Smart Expense Tracker

A full-stack personal finance management application that helps users track income, expenses, savings, spending categories, and get AI-powered financial insights.

## 🚀 Live Application

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## ✨ Features

- 🔐 User Signup & Login
- 🔑 JWT Authentication
- 💰 Track Income & Expenses
- 📊 Monthly Financial Dashboard
- 💵 Balance & Savings Calculation
- 📂 Category-wise Expense Breakdown
- 📈 Monthly Summary
- 🤖 AI-powered Financial Insights
- 💬 AI Chat for Personal Spending Questions
- 📱 Responsive UI
- ⚡ Centralized API Configuration
- ❤️ Health Monitoring with UptimeRobot

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### AI

- Google Gemini API

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database
- UptimeRobot — Backend Monitoring

## 📁 Project Structure

FLOW----------------------------------------------------------------------------
smart-expense-tracker/
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── services/
│       └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
└── README.md

🔄 Application Architecture---------------------------------------------------------
          React + Vite
               │
               ▼
            Vercel
               │
               ▼
       Node.js + Express
               │
        ┌──────┴──────┐
        ▼             ▼
 MongoDB Atlas    Gemini API

🤖 AI Features
The application uses Google Gemini to provide personalized financial assistance.
The AI can work with the user's financial data such as:
- Total income
- Total expenses
- Savings
- Current balance
- Spending categories
- Number of transactions
Users can ask questions such as:
How much did I spend this month?
What is my highest spending category?
How much did I save?
Give me some budgeting advice.

AI chat functionality is currently being improved to provide better conversational responses for general messages such as "Hi" and "Hello".

⚙️ Environment Variables
Backend
Create a .env file inside the backend directory:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production

Frontend
The frontend uses a centralized API configuration:
frontend/src/services/config.js

Optional environment variable:
VITE_API_BASE_URL=your_backend_url

⚠️ Never commit .env files, API keys, database credentials, or JWT secrets to GitHub.
💻 Local Setup
1. Clone Repository
git clone https://github.com/aditya-kumar3/smart-expense-tracker.git
cd smart-expense-tracker

2. Start Backend
cd backend
npm install
npm start

3. Start Frontend
Open another terminal:
cd frontend
npm install
npm run dev

❤️ Backend Health Check
The backend provides a health endpoint:
GET /health

Expected response:
OK

This endpoint is monitored periodically using UptimeRobot.
🔐 Security
- Secrets are stored using environment variables.
- MongoDB credentials are not stored in source code.
- JWT is used for authentication.
- API keys should never be committed to GitHub.
- Credentials should be rotated if accidentally exposed.
📌 Current Status
Feature	Status
Frontend	✅ Live
Backend	✅ Live
MongoDB	✅ Connected
Authentication	✅ Working
Dashboard	✅ Working
Expense Tracking	✅ Working
Financial Calculations	✅ Working
AI Insights	✅ Working
AI Chat	🟡 Being Improved
Health Monitoring	✅ Active


🎯 Future Improvements
- Better conversational AI responses
- Improved AI fallback handling
- More advanced financial recommendations
- Budget planning
- Expense forecasting
- Better AI-powered spending analysis
👨‍💻 Developer
Aditya Kumar
Built with ❤️ using React, Node.js, MongoDB and AI.

**GitHub → Add file → Create new file → `README.md` → paste → Commit changes.**

