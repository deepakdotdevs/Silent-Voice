# 🔊 SilentVoice - Campus Safety Platform

**SilentVoice** is a modern, full-stack anonymous reporting platform designed for campus safety. It empowers students to report incidents anonymously while providing administrators with powerful tools to track and resolve safety issues in real-time.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen.svg)
![React](https://img.shields.io/badge/React-v18+-61dafb.svg)

---

## ✨ Key Features

### 🔒 **Anonymous Reporting**
- 100% anonymous incident reporting
- No user registration required
- Privacy-first design

### 🤖 **AI-Powered Triage**
- Automatic priority classification
- Smart categorization of reports
- Urgent issues flagged instantly

### 🗺️ **Interactive Safety Map**
- Live campus safety heatmap
- Community awareness features
- Location-based incident visualization

### 📊 **Real-Time Dashboard**
- Comprehensive admin panel
- Live statistics and analytics
- Report status tracking

### 📱 **Responsive Design**
- Mobile-first approach
- Works across all devices
- Dark theme optimized for accessibility

---

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│                 │◄──────────────────►│                 │
│   React Client  │                    │   Node.js API   │
│   (Frontend)    │                    │   (Backend)     │
│                 │                    │                 │
└─────────────────┘                    └─────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│   Static Files  │                    │   MongoDB       │
│   (Vite Build)  │                    │   (Database)    │
└─────────────────┘                    └─────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Fast build tool
- **Custom CSS** - Responsive design system

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Git** - Version control

---

## 📂 Project Structure

```
SilentVoice/
├── client/                     # React Frontend
│   ├── public/
│   │   ├── university.jpeg     # Hero background
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ReportModal.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── SubmitReport.jsx (with tabs)
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── api.js              # API client
│   │   ├── styles.css          # Global styles
│   │   └── main.jsx            # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── models/             # Database schemas
│   │   │   ├── Admin.js
│   │   │   └── Report.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   └── reports.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── lib/
│   │   │   └── db.js           # Database connection
│   │   └── index.js            # Server entry point
│   ├── package.json
│   └── .env                    # Environment variables
│
├── original-static-version/    # Backup of old files
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### 1. Clone Repository

```bash
git clone https://github.com/deepakdotdevs/Silent-Voice.git
cd Silent-Voice
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/silentvoice
# JWT_SECRET=your-secret-key
# ADMIN_EMAIL=admin@campus.edu
# ADMIN_PASSWORD=password123

# Start development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173` (or next available port)

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# The app will connect to mongodb://127.0.0.1:27017/silentvoice
```

#### Option B: MongoDB Atlas
1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in server/.env

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/silentvoice

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL=admin@campus.edu
ADMIN_PASSWORD=password123
```

### Client Configuration

The client automatically connects to `http://localhost:5000` for API calls in development.

For production, update the API base URL in `client/src/api.js`.

---

## 🎯 Usage

### Student Portal

1. **Submit Report**
   - Choose incident category
   - Provide detailed description
   - Add location (optional)
   - Upload photo evidence (optional)
   - Submit anonymously

2. **Track Report**
   - Enter report ID
   - View current status
   - See progress updates

3. **Safety Map**
   - View campus safety hotspots
   - Community awareness

### Admin Dashboard

1. **Login**
   - Use admin credentials
   - Access secure dashboard

2. **Manage Reports**
   - View all submitted reports
   - Filter by status/priority
   - Update report status
   - View detailed information

3. **Analytics**
   - Total reports count
   - Pending vs resolved
   - High priority alerts

---

## 📱 API Endpoints

### Authentication
```
POST /api/auth/login          # Admin login
```

### Reports
```
GET  /api/reports             # Get all reports (admin)
POST /api/reports             # Submit new report
GET  /api/reports/:id         # Get specific report
PUT  /api/reports/:id         # Update report status (admin)
DELETE /api/reports/:id       # Delete report (admin)
GET  /api/reports/stats/summary # Get dashboard stats
```

---

## 🏗️ Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

---

## 📋 Testing

### Manual Testing
1. Start both frontend and backend servers
2. Visit `http://localhost:5173`
3. Test report submission flow
4. Test admin dashboard functionality
5. Test responsive behavior on different devices

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test report submission
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"category":"Test","description":"Test report","location":"","photoUrl":""}'
```

---

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the client: `npm run build`
2. Upload `dist` folder to your hosting service
3. Configure environment variables

### Backend (Heroku/DigitalOcean)
1. Set environment variables
2. Configure MongoDB connection
3. Deploy using your preferred service

### Database (MongoDB Atlas)
1. Create production cluster
2. Configure security settings
3. Update connection string

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Deepak**  
B.Tech CSE | Full-Stack Developer  
K.R. Mangalam University  
📍 India  

[![GitHub](https://img.shields.io/badge/GitHub-deepakdotdevs-181717?style=flat&logo=github)](https://github.com/deepakdotdevs)

---

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

---

## 🙏 Acknowledgments

- Campus safety teams for feedback and requirements
- Open source community for amazing tools
- University for providing testing environment

---

**Made with ❤️ for campus safety**