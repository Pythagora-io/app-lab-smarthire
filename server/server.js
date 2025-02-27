// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const organizationRoutes = require('./routes/organizationRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const { connectDB } = require("./config/database");
const cors = require("cors");
const googleSheetPoller = require('./workers/googleSheetPoller');
const archiveCleanup = require('./workers/archiveCleanup');

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variables in .env missing.");
  process.exit(-1);
}

const app = express();
const initialPort = 3000;
let currentPort = initialPort;

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use(authRoutes);

// Database connection
connectDB();

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Organization Routes
app.use('/api/organization', organizationRoutes);
// Team Routes
app.use('/api/teams', require('./routes/teamRoutes'));
// Job Posting Routes
app.use('/api/job-postings', jobPostingRoutes);
// Applicant Routes
app.use('/api/applicants', require('./routes/applicantRoutes'));
// Contract Routes
app.use('/api/contracts', require('./routes/contractRoutes'));
// Employee Routes
app.use('/api/contracts/employee', require('./routes/employeeRoutes'));
// Dashboard Routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// Google Auth Routes
app.use('/api/google', googleAuthRoutes);

// Initialize Google Sheet polling
googleSheetPoller.start();

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Function to try starting server on a port
const tryPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
      .once('listening', () => {
        console.log(`Server running at http://localhost:${port}`);
        resolve(server);
      })
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy`);
          server.close();
          resolve(false);
        } else {
          reject(err);
        }
      });
  });
};

// Start server with port fallback
const startServer = async () => {
  for (let port = initialPort; port < initialPort + 10; port++) {
    const server = await tryPort(port);
    if (server) {
      break;
    }
    console.log(`Trying port ${port + 1}...`);
  }
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});