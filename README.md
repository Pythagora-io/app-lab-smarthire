# SmartHire

SmartHire is an internal tool designed to streamline the recruitment process by centralizing applicant intake and tracking their progress through the recruitment pipeline. This platform centralizes applicant management, real-time recruitment tracking, role-based access, and provides a comprehensive dashboard for visualizing key statistics.

## Overview

SmartHire employs a full-stack architecture, utilizing React for the frontend and Express.js for the backend, with MongoDB as the database layer. Key technologies include:

**Frontend:**
- React (with Vite)
- Tailwind CSS
- shadcn/ui component library
- Concurrently for simultaneous client and server operation

**Backend:**
- Express.js
- MongoDB with Mongoose
- Google OAuth for integration with Google Sheets
- Node-Cron for scheduled tasks

**Folder Structure:**

```
client/                   # Frontend
    src/
        api/             # API request handlers
        components/      # Reusable React components
        contexts/        # React context files
        hooks/           # Custom hooks
        pages/           # Page components
        lib/             # Utility functions
    public/              # Public assets
    index.html           # HTML template
    main.tsx             # Application entry point

server/                   # Backend
    models/              # Mongoose models
    routes/              # API route handlers
    services/            # Business logic services
    config/              # Configuration files
    workers/             # Scheduled tasks
    server.js            # Server entry point
```

## Features

### Application Intake
- Integrates with Google Forms to automatically sync applicant data.
- Captures relevant information including email, name, location, CV, and position interests.

### Real-Time Application Status
- Tracks and displays the current recruitment stage of each applicant.
- Recruitment Pipeline Stages: Applied, Screened, Interview, Offer, Hired, Rejected.

### Role-Based Access
- Roles: Admin, HR Admin, Hiring Manager.
- Admins have full access, HR Admins manage applicants, and Hiring Managers can view and interact with assigned applicants.

### Dashboard
- Provides analytics on the number of applicants and distribution across pipeline stages.
- Displays the number of ongoing interviews.

### Organization Management
- Each organization is isolated with user management capabilities.
- Allows renaming the organization and managing team structures.

### Job Postings
- Create and manage job postings.
- Assign job postings to specific teams.

### Teams
- Manage teams and automatically assign new hires to respective teams.
- Displays team statistics, including total number of teams and new hires per month.

### Contracts
- Manage employment contracts including salary, type, and status.
- View contract activity logs.

## Getting Started

### Requirements

To run SmartHire locally, you will need:
- Node.js (v14 or later)
- MongoDB
- A Google account for Google Sheets integration

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SmartHire
   ```

2. **Install dependencies for both client and server:**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `server` directory based on `server/.env.example` and fill in the necessary values, especially for the MongoDB connection and Google OAuth credentials.

4. **Run the development servers:**
   Return to the root directory and start both client and server concurrently:
   ```bash
   cd ..
   npm run start
   ```

The client will be available at `http://localhost:5173` and the server at `http://localhost:3000`.

### License

Copyright (c) 2024.
