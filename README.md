<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.0-green?style=for-the-badge&logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-brightgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google" alt="Gemini AI" />
</div>

<br/>

<h1 align="center">📊 Weekly Report Generator & Team Dashboard</h1>

<p align="center">
  <strong>A full-stack team reporting system with AI-powered insights</strong>
  <br/>
  Built for the Software Engineering Internship Assignment at Sisenco Digital (Pvt) Ltd
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-setup-instructions">Setup Instructions</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-ai-chat-assistant">AI Chat Assistant</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br/>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📊 Database Design](#-database-design)
- [🚀 Setup Instructions](#-setup-instructions)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [🤖 AI Chat Assistant](#-ai-chat-assistant)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [📝 License](#-license)
- [👤 Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Role-Based Access
- **User Registration** with role selection (Team Member / Manager)
- **JWT Authentication** for secure session handling
- **Role-Based Access Control** (RBAC) for protected routes
- **Password Hashing** with bcryptjs

### 👤 Team Member Features
| Feature | Description |
|---------|-------------|
| 📝 **Create Reports** | Submit weekly reports with structured fields |
| ✏️ **Edit Reports** | Modify reports before or after submission |
| 📤 **Submit Reports** | Submit reports for manager review |
| 📋 **View History** | See all past reports organized by week |

### 👑 Manager Features
| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Overview with summary metrics and visual insights |
| 📈 **Charts** | Tasks trend, submission status, workload distribution |
| 🔍 **Filters** | Filter reports by member, project, or date range |
| 📋 **Track Status** | Monitor submission status (submitted/pending) |

### 🤖 AI Chat Assistant (Bonus)
- Powered by **Google Gemini API**
- **Conversational Q&A** about team activity
- **AI-Generated Team Summaries**
- **Data Privacy** - stateless, manager-only access

---

## 🛠️ Tech Stack

### Frontend
```yaml
Framework: Next.js 16 (App Router)
Language: TypeScript
UI Library: React 19
Styling: Tailwind CSS 3
Charts: Recharts
Icons: Lucide React
HTTP Client: Axios

Backend

Runtime: Node.js 20
Framework: Express.js 4
Language: JavaScript
Authentication: JWT + bcryptjs
Validation: Express Validator
Database: MongoDB with Mongoose ODM
AI: Google Gemini API

Database

Database: MongoDB 6.0
ODM: Mongoose 8.0
Collections: Users, Reports, Projects

🏗️ Architecture


┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                          │
│                    Next.js 16 / React 19 / TypeScript              │
│                           Tailwind CSS                             │
└─────────────────────────┬───────────────────────────────────────────┘
                          │
                          │ REST API
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER                              │
│                    Node.js 20 / Express.js 4                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Auth Middleware  │  Routes  │  Controllers  │  Models   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              AI Service (Google Gemini API)                 │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────────┘
                          │
                          │ Mongoose ODM
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE                                  │
│                   MongoDB 6.0 (Atlas / Local)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Users   │  │  Reports │  │ Projects │  │Categories│          │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────────────────────┘



📊 Database Design
ER Diagram

┌─────────────────┐          ┌─────────────────┐
│      USER       │          │     REPORT      │
├─────────────────┤          ├─────────────────┤
│ _id: ObjectId   │◄───┐    │ _id: ObjectId   │
│ name: String    │    │    │ userId: ObjectId │──┐
│ email: String   │    │    │ weekStart: Date │  │
│ password: String│    │    │ weekEnd: Date   │  │
│ role: String    │    │    │ projectCategory │  │
│ createdAt: Date │    └────│ tasksCompleted  │  │
│ updatedAt: Date │         │ tasksPlanned    │  │
└─────────────────┘         │ blockers        │  │
        │                   │ hoursWorked     │  │
        │                   │ notes: String   │  │
        │                   │ status: String  │  │
        │                   │ submittedAt:Date│  │
        │                   │ createdAt: Date │  │
        │                   │ updatedAt: Date │  │
        │                   └─────────────────┘  │
        │                                        │
        │         ┌─────────────────┐            │
        │         │    PROJECT      │            │
        │         ├─────────────────┤            │
        │         │ _id: ObjectId   │            │
        └─────────│ name: String    │            │
                  │ description: Str│            │
                  │ assignedUsers:[]│◄───────────┘
                  │ createdBy: ObjId│
                  │ isActive: Bool  │
                  │ createdAt: Date │
                  │ updatedAt: Date │
                  └─────────────────┘

Relationships:
• User → Report: One-to-Many (1:N)
• User → Project: Many-to-Many (M:N) via assignedUsers
• User → Project: One-to-Many (1:N) via createdBy

Step 1: Clone the Repository

git clone https://github.com/yourusername/weekly-report-app.git
cd weekly-report-app


Step 2: Backend Setup

# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your values
# - MongoDB connection string
# - JWT Secret
# - Gemini API Key (optional)

# Run development server
npm run dev


Step 3: Frontend Setup

# Navigate to frontend (from root directory)
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local if needed

# Run development server
npm run dev

🔑 Environment Variables
Backend (.env)

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/weekly_reports
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# AI Configuration (Optional - for Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

🤖 AI Chat Assistant
Overview
The AI Chat Assistant is a bonus feature powered by Google Gemini API. It provides intelligent insights for managers about team activity.

Features
Feature	Description
💬 Conversational Q&A	Ask questions about team reports, tasks, and blockers
📊 Team Summary	Generate comprehensive weekly summaries
⚠️ Blockers Detection	Identify recurring challenges across the team
📈 Workload Analysis	Understand task distribution and imbalances

📁 Project Structure

weekly-report-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js                  # JWT & RBAC middleware
│   │   ├── models/
│   │   │   ├── User.js                  # User schema
│   │   │   ├── Report.js                # Report schema
│   │   │   └── Project.js               # Project schema
│   │   ├── routes/
│   │   │   ├── auth.js                  # Authentication routes
│   │   │   ├── reports.js               # Report routes
│   │   │   └── ai.js                    # AI Assistant routes
│   │   └── server.js                    # Express server
│   ├── .env                             # Environment variables
│   └── package.json                     # Backend dependencies
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # Login page
│   │   │   └── register/
│   │   │       └── page.js             # Register page
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Manager Dashboard
│   │   ├── reports/
│   │   │   ├── page.tsx                # My Reports
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # New Report
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx        # Edit Report
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home page
│   │   └── globals.css                  # Global styles
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx              # Navigation
│   │   │   ├── Footer.tsx              # Footer
│   │   │   ├── ClientProviders.tsx     # Providers wrapper
│   │   │   └── AIChatWidget.tsx        # AI Chat Widget
│   │   └── reports/
│   │       └── ReportForm.js           # Report form
│   ├── context/
│   │   └── AuthContext.tsx             # Auth context
│   ├── lib/
│   │   └── api.ts                      # API client
│   ├── .env.local                       # Environment variables
│   └── package.json                     # Frontend dependencies
│
├── docs/
│   └── ER-Diagram.png                   # Database design
│
├── .gitignore
└── README.md




