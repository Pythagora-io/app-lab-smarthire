```markdown
# SmartHIre

SmartHIre is an advanced internal recruitment tool designed to streamline the application process by centralizing applicant data intake and tracking. It simplifies the recruitment workflow by integrating Google Forms for automatic applicant creation, providing real-time application status updates, role-based access, job postings, and team management.

## Overview

SmartHIre is built with a modern full-stack architecture, leveraging ReactJS for the frontend, Express.js for the backend, and MongoDB for data storage. The project utilizes token-based authentication with JWT and follows best practices for code organization and maintainability.

### Technologies Used

- **Frontend**: 
  - ReactJS (with Vite DevServer)
  - Shadcn-ui component library
  - Tailwind CSS
  - React Router DOM

- **Backend**: 
  - Node.js (Express.js)
  - MongoDB (with Mongoose)
  - JWT for authentication

### Project Structure

- **client/**: Contains the ReactJS frontend code.
  - **api/**: API request files with mocked data.
  - **components/**: Reusable React components.
  - **contexts/**: Context for authentication.
  - **hooks/**: Custom hooks.
  - **pages/**: Main pages of the application.
  - **styles/**: Global CSS styles.
- **server/**: Contains the Express.js backend code.
  - **config/**: Configuration files for database and Google OAuth.
  - **models/**: Mongoose schemas.
  - **routes/**: Express route handlers.
  - **services/**: Business logic.
  - **utils/**: Utility functions.
  - **workers/**: Scheduled jobs.

## Features

1. **Application Intake**
   - Integrate Google Forms to sync applicant data.
   - Fields: Email, Name, Location, CV upload, Positions interested, Additional file.

2. **Real-Time Application Status**
   - Track recruitment stages: Applied, Screened, Interview Stages, Offer, Hired, Rejected.
   - Assign applicants to job postings.

3. **Role-Based Access**
   - User roles: HR Admin, Hiring Manager, Admin.
   - Different access levels and functionalities for each role.

4. **Dashboard**
   - View applicant distribution across pipeline stages.
   - List of leave approvals with Approve and Cancel buttons.

5. **Organization Management**
   - Isolated data for each organization.
   - Manage organization details and users.

6. **Job Postings**
   - Create and manage job postings.
   - Assign job postings to teams.

7. **Teams**
   - Manage teams within an organization.
   - Dashboard for team insights.
   
8. **Contracts**
   - Manage contracts associated with job postings and hired applicants.

## Getting Started

### Requirements

To run this project, you need:

- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- Google account for OAuth integration (for Google Forms feature)

### Quickstart

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/SmartHIre.git
cd SmartHIre
```

2. **Install dependencies**

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Set up environment variables**

Create a `.env` file in the `server/` directory with the following content:

```env
PORT=3000
MONGODB_URL=mongodb://localhost:27017/smarthire
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. **Run the application**

```bash
# In the project root directory
npm run start
```

This command runs both the frontend and backend using concurrently.

5. **Access the application**

Open your browser and navigate to `http://localhost:5173` to access the application.

### License

The project is proprietary (not open source). All rights reserved.  
Copyright (c) 2024.
```
