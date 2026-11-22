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
5. Copy `database/.env.example` to `database/.env` for local API/Liquibase values and `client/.env.example` to `client/.env` for the local frontend proxy.
6. Export API values into your shell:

   ```bash
   set -a
   source database/.env
   set +a
   ```
7. Run `./database/script.sh validate`, then `./database/script.sh preview` to review the planned schema. Run `./database/script.sh update` to apply it to an empty local database.
8. Optional: load sample data into a disposable database with `(cd api && ALLOW_DESTRUCTIVE_SEED=true npm run seed)`. This drops and recreates the application tables.
9. From the project root, run `npm run dev` to start both the server and client.
10. Open the local frontend URL printed by the React development server.

Alternatively, start them separately:
- Start the server: `npm start` in the `api` folder (runs on port 5000)
- Start the client: `npm start` in the `client` folder (runs on port 3000)

### Environment Setup

Copy `database/.env.example` to `database/.env` and set its local values. That file is for your shell and Liquibase script; the API never loads it directly. The central API configuration in `api/config/runtime.js` reads only process environment variables.

The main settings are:

```
NODE_ENV=development
HOST=0.0.0.0
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=faculty_db
DB_USER=your_db_user
DB_PASS=your_db_password
DB_DIALECT=mysql
JWT_SECRET=generate_a_long_random_secret
DB_POOL_MAX=5
DB_SSL=false
```

Copy `client/.env.example` to `client/.env` to set the development server host and API proxy target. `client/src/config.js` keeps the browser API path at `/api`; the proxy target is used by the development server and is not bundled into the frontend.

The Liquibase changelog creates tables in an empty database. If your local database already has tables created by Sequelize `sync()`, do not apply the initial changelog against it as-is: use a new empty development database or carefully baseline the existing schema first. The API does not create or change tables at startup.

The API reads configuration only from process environment variables; it does not load `.env` files or call AWS Secrets Manager. In EKS, use an AWS Secrets Manager integration with pod IAM identity to provide required values to the container as environment variables, and set `NODE_ENV=production`. Same-origin `/api` routing needs no CORS allowlist; if using a separate frontend/API origin, set `CORS_ORIGINS`. Set `TRUST_PROXY` to match the actual trusted proxy chain; do not blindly trust all forwarded headers. For RDS TLS, set `DB_SSL=true` and `DB_SSL_CA_PATH` to the mounted CA bundle path. Configure `DB_POOL_MAX` so pool size times the maximum pod count stays within RDS connection capacity.

## Available Scripts

### Root

- `npm run dev`: Starts both the API server and React client concurrently.

### In `/api`

- `npm install`: Installs backend dependencies.
- `(cd api && ALLOW_DESTRUCTIVE_SEED=true npm run seed)`: Drops and recreates application tables, then loads sample data. Export `database/.env` first and use only with disposable development data; production execution is blocked.

Schema setup is managed separately from the API by Liquibase. Use `./database/script.sh validate`, `preview`, `status`, or `update`; see [`database/liquibase/README.md`](database/liquibase/README.md) for details.
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
