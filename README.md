# SmartHIre

SmartHIre is an internal tool designed to streamline the recruitment process by centralizing applicant intake and tracking their progress through the recruitment pipeline. The platform integrates with Google Forms to automatically sync applicant data and provides comprehensive role-based access tailored for HR Admins, Hiring Managers, and Admins. 

## Overview

SmartHIre leverages a modern web architecture comprised of a React-based frontend and an Express-based backend. The integration of these technologies ensures a seamless and responsive user experience.

### Technologies Used
- **Frontend**: ReactJS, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Express, MongoDB, Mongoose
- **Authentication**: JWT, OAuth2 (Google)
- **Others**: axios, concurrently, node-cron, bcrypt

### Project Structure

The project is structured into two main parts:
1. **Frontend** (`client/`): 
    - **React Components** (`client/src/components`): Individual components, utilizing shadcn-ui and Tailwind CSS.
    - **API Services** (`client/src/api`): API requests to the backend, using axios.
    - **Pages** (`client/src/pages`): Main route components implemented with `react-router-dom`.

2. **Backend** (`server/`):
    - **Routes** (`server/routes`): Express route handlers for different resources.
    - **Models** (`server/models`): Mongoose models representing the data structure.
    - **Services** (`server/services`): Business logic, interacting with models and external services like Google Sheets.
    - **Workers** (`server/workers`): Scheduled tasks, like periodic polling of Google Sheets for new responses.

## Features

### Key Features in the MVP

1. **Application Intake**:
   - Integration with Google Forms to automatically sync applicant data.
   - Comprehensive application fields including Email, Name, Location, CV upload, Positions interested, and additional files.

2. **Real-Time Application Status**:
   - Tracking and displaying the current recruitment stage of each applicant.
   - Assignment of applicants to specific job postings.
   - Defined recruitment pipeline stages: Applied, Screened, Interview, Offer, Hired, Rejected.

3. **Role-Based Access**:
   - **HR Admin**: Full management access to applicants and the ability to assign Hiring Managers.
   - **Hiring Manager**: View-only access to applicants assigned to their job postings.
   - **Admin**: Full organizational access.

4. **Dashboard**:
   - Provides visual insights on the total number of applicants and their pipeline stage distribution.
   - Displays ongoing interviews without a time span constraint.

5. **Organization Management**:
   - Organizational isolation: data and users are unique to each organization.
   - Admin capabilities to rename the organization, manage users, and handle Google Forms integration.

6. **Job Postings**:
   - Creation and management of job postings, detailing team requirements.

7. **Teams**:
   - Manage team structures and view insights such as total number of teams, employee counts, and new hires.

8. **Contracts**:
   - Contract management including associated job postings, salary, type, and status changes.

## Getting started

### Requirements

Ensure the following technologies are set up on your computer:
- Node.js
- MongoDB

### Quickstart

1. **Clone the repository**
   ```sh
   git clone <repository_url>
   cd SmartHIre
   ```

2. **Install Dependencies**
   - For the backend:
     ```sh
     cd server
     npm install
     ```

   - For the frontend:
     ```sh
     cd client
     npm install
     ```

3. **Configure Environment Variables**
   - Create a `.env` file in the `server` directory based on `.env.example` and update the values accordingly.

4. **Run the Project**
   - Use the `concurrently` script to run both client and server:
     ```sh
     npm run start
     ```

5. **Access the Application**
   - Open your browser to `http://localhost:5173` to start using SmartHIre.

### License

The project is proprietary (not open source). 
```
The project is proprietary. Copyright (c) 2024.
```