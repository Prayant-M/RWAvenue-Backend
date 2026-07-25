# Education Management System - Developer Skill Test

A comprehensive full-stack web application for managing school operations including students, staff, classes, notices, and leave management. This project serves as a skill assessment platform for **Frontend**, **Backend**, and **Blockchain** developers.

## 🏗️ Project Architecture

```
Education_Management_System/
├── backend/                # Project root (API + frontend)
│   ├── frontend/           # React + TypeScript + Material-UI
│   ├── src/                # Node.js + Express API
│   ├── package.json        # Run `npm run dev` here
│   └── .env
├── go-service/             # Golang microservice for PDF reports (optional)
├── seed_db/                # Database schema and seed data
└── Readme.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn


### Application Setup
Open the `backend` folder as the project root, then install and run:

```bash
cd backend
npm install
npm run dev
```

On first setup, `npm install` and `npm run dev` automatically create `.env` and `frontend/.env` from their `.env.example` files if they do not already exist. Existing `.env` files are never overwritten.

This starts the **backend API** and **frontend dev server** at the same time.

### For Frontend Developers
Even if you are working on frontend tasks only, run the backend together with the frontend using `npm run dev` from the `backend/` folder.

The UI depends on the API for login, data loading, form submission, and error handling. Running the frontend alone will only show the login screen and most features will not work. Running both services lets you verify the full frontend behavior and its communication with the backend.


### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5007
- **Demo Credentials**:
  - Username: `admin@school-admin.com`
  - Password: `3OU4zn3q6Zh9`


### Database Setup
Run these commands from the repository root:

```bash
# Create PostgreSQL database
createdb school_mgmt

# Run database migrations
psql -d school_mgmt -f seed_db/tables.sql
psql -d school_mgmt -f seed_db/seed-db.sql
```

## 🎯 Skill Test Problems

All paths below are relative to the repository root unless noted otherwise.

### **Problem 1: Frontend Developer Challenge**
**Fix "Add New Notice" Page**
- **Route**: `/app/notices/add`
- **Primary files**:
  - `backend/frontend/src/domains/notice/pages/add-notice-page.tsx`
  - `backend/frontend/src/domains/notice/components/notice-form.tsx`
  - `backend/frontend/src/domains/notice/api/notice-api.ts`
- **Issue**: When clicking the **Save** button, the `description` field doesn't get saved
- **Skills Tested**: React, Form handling, State management, API integration
- **Expected Fix**: Ensure the description field is properly bound and submitted to the API
- **How to test**: Run `npm run dev` from `backend/`, log in, open **Notices → Add New Notice**, save, and confirm the description persists

### **Problem 2: Backend Developer Challenge**
**Complete CRUD Operations in Student Management**
- **Primary files**:
  - `backend/src/modules/students/students-controller.js`
  - `backend/src/modules/students/students-service.js`
  - `backend/src/modules/students/students-repository.js`
  - `backend/src/modules/students/sudents-router.js`
- **Issue**: Implement missing CRUD operations for student management
- **Skills Tested**: Node.js, Express, PostgreSQL, API design, Error handling
- **Expected Implementation**: Full Create, Read, Update, Delete operations
- **How to test**: With the API running from `backend/`, test `GET/POST/PUT/DELETE /api/v1/students` using Postman or curl

### **Problem 3: Blockchain Developer Challenge**
**Implement Certificate Verification System**
- **Objective**: Add blockchain-based certificate verification for student achievements
- **Suggested locations**:
  - Smart contracts: new `contracts/` directory at repository root or inside `backend/`
  - Frontend integration: `backend/frontend/src/domains/`
  - Admin UI: extend student-related pages under `backend/frontend/src/domains/student/`
- **Skills Tested**: Smart contracts, Web3 integration, Ethereum/Polygon
- **Requirements**:
  - Create smart contract for certificate issuance and verification
  - Integrate Web3 wallet connection in the frontend
  - Add certificate management in the admin panel
  - Implement IPFS for certificate metadata storage
- **How to test**: Run the app from `backend/` with `npm run dev`, connect a wallet, issue a certificate, and verify it on-chain

### **Problem 4: Golang Developer Challenge**
**Build PDF Report Generation Microservice via API Integration**
- **Objective**: Create a standalone microservice in Go to generate PDF reports for students by consuming the existing Node.js backend API
- **Location**: new `go-service/` directory at the repository root
- **Backend dependency**: Node.js API in `backend/` must be running on `http://localhost:5007`
- **Description**: Connect to `GET /api/v1/students/:id`, use the returned JSON to generate a downloadable PDF report
- **Skills Tested**: Golang, REST API consumption, JSON parsing, file generation, microservice integration
- **Requirements**:
  - Create endpoint `GET /api/v1/students/:id/report` in the Go service
  - The Go service must not connect directly to the database; it must fetch data from the Node.js API
  - PostgreSQL and the Node.js backend must be running to complete this task
- **How to test**:
  1. Seed the database from `seed_db/`
  2. Start the API from `backend/` with `npm run dev:server`
  3. Start the Go service
  4. Request `GET /api/v1/students/:id/report` and verify the PDF output

### **Problem 5: DevOps Engineer Challenge**
**Containerize the Full Application Stack**
- **Objective**: Create a multi-container setup to run the entire application stack (Frontend, Backend, Database) using Docker and Docker Compose
- **Location**:
  - `backend/frontend/Dockerfile`
  - `backend/Dockerfile`
  - `docker-compose.yml` at the repository root
- **Description**: Make the development environment reproducible and launchable with a single command
- **Skills Tested**: Docker, Docker Compose, container networking, database seeding in a container, environment variable management
- **Requirements**:
  - Write a `Dockerfile` for the frontend service in `backend/frontend/`
  - Write a `Dockerfile` for the backend service in `backend/`
  - Create a `docker-compose.yml` at the repository root linking frontend, backend, and postgres services
  - Automatically seed postgres from `seed_db/` on first run
  - Launch the full stack with `docker-compose up`
- **How to test**: Run `docker-compose up --build` from the repository root and log in at `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **UI Library**: Material-UI (MUI) v6
- **State Management**: Redux Toolkit + RTK Query
- **Form Handling**: React Hook Form + Zod validation
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, Husky

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + CSRF protection
- **Password Hashing**: Argon2
- **Email Service**: Resend API
- **Validation**: Zod

### Database
- **Primary DB**: PostgreSQL
- **Schema**: Comprehensive school management schema
- **Features**: Role-based access control, Leave management, Notice system

## 📋 Features

### Core Functionality
- **Dashboard**: User statistics, notices, birthday celebrations, leave requests
- **User Management**: Multi-role system (Admin, Student, Teacher, Custom roles)
- **Academic Management**: Classes, sections, students, class teachers
- **Leave Management**: Policy definition, request submission, approval workflow
- **Notice System**: Create, approve, and distribute notices
- **Staff Management**: Employee profiles, departments, role assignments
- **Access Control**: Granular permissions system

### Security Features
- JWT-based authentication with refresh tokens
- CSRF protection
- Role-based access control (RBAC)
- Password reset and email verification
- Secure cookie handling

## 🔧 Development Guidelines

### Code Standards
- **File Naming**: kebab-case for consistency across OS
- **Import Style**: Absolute imports for cleaner code
- **Code Formatting**: Prettier with consistent configuration
- **Git Hooks**: Husky for pre-commit quality checks

### Project Structure
```
backend/
├── frontend/src/  # React application
│   ├── api/           # API configuration and base setup
│   ├── assets/        # Static assets (images, styles)
│   ├── components/    # Shared/reusable components
│   ├── domains/       # Feature-based modules
│   │   ├── auth/      # Authentication module
│   │   ├── student/   # Student management
│   │   ├── notice/    # Notice system
│   │   └── ...
│   ├── hooks/         # Custom React hooks
│   ├── routes/        # Application routing
│   ├── store/         # Redux store configuration
│   ├── theme/         # MUI theme customization
│   └── utils/         # Utility functions
└── src/               # Express API
    ├── config/        # Database and app configuration
    ├── middlewares/   # Express middlewares
    ├── modules/       # Feature-based API modules
    │   ├── auth/      # Authentication endpoints
    │   ├── students/  # Student CRUD operations
    │   ├── notices/   # Notice management
    │   └── ...
    ├── routes/        # API route definitions
    ├── shared/        # Shared utilities and repositories
    ├── templates/     # Email templates
    └── utils/         # Helper functions
```

## 🧪 Testing Instructions

### For Frontend Developers
1. From `backend/`, run `npm run dev`
2. Log in at `http://localhost:5173` with the demo credentials
3. Open **Notices → Add New Notice** (`/app/notices/add`)
4. Create a notice with a description and click **Save**
5. Verify the description is saved correctly
6. Review code under `backend/frontend/src/domains/notice/`

### For Backend Developers
1. From `backend/`, run `npm run dev:server`
2. Test all student CRUD endpoints at `http://localhost:5007/api/v1/students`
3. Review code under `backend/src/modules/students/`
4. Verify proper error handling, validation, and database relationships
5. Test authentication and authorization

### For Blockchain Developers
1. From `backend/`, run `npm run dev`
2. Set up a local blockchain environment (Hardhat/Ganache)
3. Deploy the certificate smart contract
4. Integrate Web3 wallet connection in `backend/frontend/src/domains/`
5. Test certificate issuance and verification flow in the admin UI

### For Golang Developers
1. Set up the PostgreSQL database using `seed_db/` files from the repository root
2. Start the Node.js backend from `backend/` with `npm run dev:server`
3. Create and run the Go service in `go-service/`
4. Request `GET /api/v1/students/:id/report` from the Go service
5. Verify the Go service calls the Node.js backend and returns a valid PDF

### For DevOps Engineers
1. Ensure Docker and Docker Compose are installed
2. Add Dockerfiles to `backend/` and `backend/frontend/`, plus `docker-compose.yml` at the repository root
3. From the repository root, run `docker-compose up --build`
4. Access the frontend at `http://localhost:5173`
5. Log in with the demo credentials to confirm frontend, backend, and database communication

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/refresh` - Refresh access token

### Student Management
- `GET /api/v1/students` - List all students
- `POST /api/v1/students` - Create new student
- `PUT /api/v1/students/:id` - Update student
- `DELETE /api/v1/students/:id` - Delete student

### Notice Management
- `GET /api/v1/notices` - List notices
- `POST /api/v1/notices` - Create notice
- `PUT /api/v1/notices/:id` - Update notice
- `DELETE /api/v1/notices/:id` - Delete notice

### PDF Generation Service (Go)
- `GET /api/v1/students/:id/report` - Generate and download a PDF report for a specific student.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions and support:
- Create an issue in the repository
- Check existing documentation in `backend/README.md` and `backend/frontend/README.md`
- Review the database schema in `seed_db/tables.sql`

---

**Happy Coding! 🚀**