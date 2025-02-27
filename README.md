# SmartHire

SmartHire is an internal tool designed to streamline the recruitment process by centralizing applicant intake and tracking their progress through the recruitment pipeline. It integrates seamlessly with Google Forms for automatic data ingestion, enabling efficient management of job postings, applicants, and teams.

## Overview

SmartHire's architecture is based on a client-server model, leveraging:

- **Frontend**: ReactJS with Vite, utilizing Vite's development server for efficient frontend development. The frontend integrates `shadcn-ui` components styled with Tailwind CSS, ensuring a modern, responsive UI.
- **Backend**: An Express.js server that provides REST API endpoints, facilitates communication with a MongoDB database using Mongoose, and handles authentication and integration services.
- **Database**: MongoDB for data storage, handling collections for users, applicants, job postings, teams, etc.
- **Authentication**: JWT-based token authentication, supporting both access tokens and refresh tokens.
- **Integrations**: Google Forms and Google Sheets for automatic applicant data ingestion.

### Project Structure

The project is structured into client and server parts:

- **Client** (located in `client/`):
  - **Main Technologies**: ReactJS, `shadcn-ui`, Tailwind CSS, `react-router-dom`
  - **Folder Structure**:
    - `src/pages/` - Page components for different views (Dashboard, Applicants, Job Postings, etc.)
    - `src/components/` - Reusable UI components
    - `src/api/` - API interaction logic with backend
    - `src/contexts/` - Context management with React Context API (e.g., AuthContext)
  
- **Server** (located in `server/`):
  - **Main Technologies**: Node.js, Express.js, Mongoose
  - **Folder Structure**:
    - `models/` - Mongoose schemas and models
    - `routes/` - API route handlers
    - `services/` - Business logic for different features (e.g., applicantService, jobPostingService)
    - `config/` - Configuration files (e.g., database configuration, Google OAuth setup)
    - `workers/` - Background jobs for tasks like Google Sheets polling and archive cleanup
    - `utils/` - Utility functions (e.g., JWT generation, password hashing)

## Features

SmartHire includes a variety of features designed to optimize recruitment workflows:

1. **Application Intake**:
   - Automatic data synchronization from Google Forms.
   - Applicant details include email, name, location, CV and additional files, and positions of interest.

2. **Real-Time Application Status**:
   - Track and display current recruitment stages for applicants.
   - Assign applicants to relevant job postings.
   - Stages include: Applied, Screened, Interview, Offer, Hired, Rejected.

3. **Role-Based Access Control**:
   - Three user roles: Admin, HR Admin, Hiring Manager, each with different access rights.
   - Organizations are isolated; users see data relevant only to their organization.

4. **Dashboard**:
   - Overview of application metrics, such as total number of applicants and distribution across pipeline stages.

5. **Organization Management**:
   - Admins can manage organization details, user roles, and the integration with Google Forms/Sheets for automatic data polling.

6. **Job Postings and Teams**:
   - Create and manage job postings.
   - Organize teams and view associated metrics.

7. **Contracts**:
   - Manage employment contracts, including status updates, salary adjustments, and employment types.

## Getting Started

### Requirements

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher
- **MongoDB**: Running instance (version 4.x or higher)
- **Google Cloud**: Set up with OAuth 2.0 credentials for Google Forms and Sheets integration

### Quickstart

1. **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Backend Setup**:
    - Install dependencies:
        ```bash
        cd server
        npm install
        ```
    - Set up environment variables:
        - Copy `.env.example` to `.env` and configure the required environment variables.
    - Start the backend server:
        ```bash
        npm run start
        ```

3. **Frontend Setup**:
    - Install dependencies:
        ```bash
        cd ../client
        npm install
        ```
    - Start the frontend development server:
        ```bash
        npm run start
        ```

4. **Access the Application**:
    - The application should now be running, accessible at:
        - Frontend: `http://localhost:5173`
        - Backend: `http://localhost:3000`

### License

The project is proprietary. Copyright (c) 2024.

---

By following the instructions above, you should be able to get SmartHire up and running on your local machine and start leveraging its powerful recruitment management features.