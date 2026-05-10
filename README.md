# Faculty Competence Management System

This project is a Full Stack Web application built with React and a REST API. It serves as a platform for faculty members to manage and track their academic achievements and professional activities.

## Features

- User Authentication: Sign up and log in with JWT-based sessions.
- View and manage courses, journals, conferences, books, patents, and events.
- Add new entries to user profiles.
- Edit or delete entries (with required authorization).
- Generate PDF reports for various academic achievements.
- View real-time data analysis through charts and graphs.

## Motivation

This project streamlines faculty competence management, making it easier for faculty members to organize and document their contributions. The application is designed to be scalable and user-friendly, with features aimed at enhancing academic productivity.

## Technologies Used

- **Frontend**: React, React Router DOM, Tailwind CSS, Reactstrap, Recharts, Axios, Lucide React, html2pdf.js
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: MySQL
- **Authentication**: JWT (`jsonwebtoken`) & `js-cookie` for session management
- **Security**: Helmet, express-rate-limit, HPP (HTTP Parameter Pollution protection), CORS, bcrypt
- **Dev Tools**: Nodemon, Concurrently, Morgan

## Getting Started

### Downloading

Click on the 'Code' button and clone this project via the command line or select 'Download Zip.'

### Prerequisites

- Node.js and npm installed
- MySQL server running locally

### Installing and Running

1. Unzip the zip file if you downloaded this project as a zip file.
2. Open the project folder in your command line tool.
3. Run `npm install` in the root, `api`, and `client` folders.
4. Set up the database (see Environment Setup below).
5. In the `api` folder, run `npm run seed` to initialize the database with sample data.
6. From the project root, run `npm run dev` to start both the server and client concurrently.
7. Open your browser and navigate to http://localhost:3000 to view the app.

Alternatively, start them separately:
- Start the server: `npm start` in the `api` folder (runs on port 5000)
- Start the client: `npm start` in the `client` folder (runs on port 3000)

### Environment Setup

Create an `.env` file in the root of the `api` folder with the following:

```
DB_HOST=localhost
DB_NAME=faculty_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DIALECT=mysql
JWT_SECRET=your_secret_key
PORT=5000
```

## Available Scripts

### Root

- `npm run dev`: Starts both the API server and React client concurrently.

### In `/api`

- `npm install`: Installs backend dependencies.
- `npm run seed`: Initializes the database with sample data.
- `npm start`: Starts the Express server.

### In `/client`

- `npm install`: Installs frontend dependencies.
- `npm start`: Starts the React development server.

## Testing the API with Postman

To test the backend API, use Postman or any other API testing tool. Import the sample requests from the `PostmanCollection` folder to easily test all endpoints.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate and receive JWT |
| GET/POST | `/api/users` | User management |
| GET | `/api/resources/:type` | List user's resources |
| POST | `/api/resources/:type` | Create a new resource |
| GET | `/api/resources/:type/:id` | View a single resource |
| PUT | `/api/resources/:type/:id` | Update a resource |
| DELETE | `/api/resources/:type/:id` | Delete a resource |

Resource types: `courses`, `journals`, `conferences`, `books`, `patents`, `events`

## Folder Structure

```
faculty-competence/
├── api/                   # Node.js/Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handling logic
│   ├── middleware/        # Auth & error handling middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API route definitions
│   ├── seed/              # Database seeding scripts
│   └── app.js             # Express app entry point
├── client/                # React frontend
│   └── src/
│       ├── components/
│       │   ├── dashboard/ # Analytics & charts
│       │   ├── resource/  # CRUD views for each resource type
│       │   ├── user/      # Auth components
│       │   ├── layout/    # Header & layout
│       │   └── errors/    # Error pages
│       ├── App.js         # Main routing
│       ├── Context.js     # Global state via Context API
│       ├── Data.js        # API utility functions
│       └── resources/
│           └── config.js  # Resource field definitions
└── package.json           # Root workspace config
```

Map cluster IP to a dummy URL for minikube
minikube tunnel
echo "127.0.0.1 fcms.local" | sudo tee -a /etc/hosts