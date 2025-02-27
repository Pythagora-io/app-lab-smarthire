# SmartHire

SmartHire is an advanced internal tool designed to streamline the recruitment process by centralizing applicant intake and tracking their progress through the recruitment pipeline. This tool integrates with Google Forms to automatically sync applicant data and provides real-time status updates, role-based access, and management of job postings and contracts.

## Overview

### Architecture and Technologies

SmartHire is built as a full-stack application with the following components:

- **Frontend**: Developed using ReactJS, with client-side routing managed by `react-router-dom`. The frontend utilizes the Vite devserver for development and integrates `shadcn-ui` components with the Tailwind CSS framework.
  
- **Backend**: Implemented using Express.js, providing a REST API to handle various functionalities. MongoDB is used as the database, interfaced through Mongoose. Token-based authentication is employed using bearer access and refresh tokens.

- **Database**: MongoDB for data storage, managed through the Mongoose library.

### Project Structure

- **Frontend (`client/`)**: 
  - `src/` – Contains React components, pages, hooks, APIs, and context setup.
  - `api/` – Defines API utility functions to interact with the backend.
  - `components/` – Contains reusable UI components.
  - `pages/` – Contains page components corresponding to different routes.
  - `App.tsx` – Main application component for defining routes and layout.
  - `index.css` – CSS file including Tailwind CSS and custom styles.
  - `vite.config.ts` – Configuration for the Vite build tool.

- **Backend (`server/`)**: 
  - `config/` – Contains configuration files for database and Google API authentication.
  - `models/` – Defines Mongoose schemas for various entities such as Applicants, Organizations, Teams, etc.
  - `routes/` – Implements API route handlers.
  - `services/` – Contains service classes performing business logic and database operations.
  - `workers/` – Scheduled jobs for tasks like Google Sheets polling.
  - `server.js` – Main server file to set up and start the Express.js server.
  - `.env` – Environment variables for server configuration.

## Features

### Key Features in the MVP

1. **Application Intake**:
   - Integrates Google Forms to automatically sync applicant data into the platform.
   - Includes fields such as Email, Name, Location, CV upload, Positions interested, and an additional file upload option.

2. **Real-Time Application Status**:
   - Tracks and displays the current recruitment stage of each applicant.
   - Defines stages like Applied, Screened, Interview, Offer, Hired, and Rejected.

3. **Role-Based Access**:
   - Three user roles:
     - **HR Admin**: Full access to manage applicants and update statuses.
     - **Hiring Manager**: View access limited to assigned applicants and job postings.
     - **Admin**: Full access to all organization data and settings.

4. **Dashboard**:
   - Displays applicant distribution across pipeline stages and lists leave approvals.

5. **Organization Management**:
   - Organization-level isolation ensuring data privacy.
   - Admins can manage organization details, rename organizations, and create/manage users.

6. **Job Postings**:
   - Allows creating, updating, and managing job postings and associated teams.

7. **Teams**:
   - Enables management of teams, employees, and their assignments.

8. **Contracts**:
   - Manages contracts with associated job postings and applicants, including salary, type, and status updates.
   
### Additional Implemented Features

1. **Google Forms Integration**:
   - Automatic applicant creation from Google Forms responses.
   - Admins can set up integration by connecting their Google account and specifying the Google Sheet URL.

2. **Hiring Manager Assignment**:
   - HR Admin can assign applicants to Hiring Managers.
   - Hiring Manager can view and interact with assigned applicants only.

## Getting Started

### Requirements

Ensure you have the following installed:

- Node.js (>= 14.x)
- MongoDB (>= 4.x)
- npm (Node Package Manager)
- Modern web browser

### Quickstart

Follow these steps to set up and run the project:

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd SmartHire
   ```

2. **Install dependencies**:
   - **Frontend**:
     ```bash
     cd client
     npm install
     ```
   - **Backend**:
     ```bash
     cd server
     npm install
     ```

3. **Configure environment variables**:
   - Create a `.env` file in the `server/` directory based on the `.env.example` file and set the required environment variables.

4. **Seed the database**:
   Run the seed script to populate the initial data:
   ```bash
   npm run seed
   ```

5. **Start the development servers**:
   - Run both frontend and backend concurrently:
     ```bash
     npm run start
     ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:5173` for the frontend, and `http://localhost:3000` for the backend API.

## License

Proprietary software. All rights reserved.

```2024 SmartHire Project. All rights reserved.```