# Faculty Competence Management System

This project is a Full Stack Web application built with React and a REST API. It serves as a platform for faculty members to manage and track their academic achievements and professional activities.

## Features

- User Authentication: Sign up and log in.
- View and manage courses, papers, conferences, books, patents, and events.
- Add new entries to user profiles.
- Edit or delete entries (with required authorization).
- Generate reports for various academic achievements.
- View real-time data analysis through charts and graphs.

## Motivation

This project streamlines faculty competence management, making it easier for faculty members to organize and document their contributions. The application is designed to be scalable and user-friendly, with features aimed at enhancing academic productivity.

## Technologies Used

- **Frontend**: React, React Router, Hooks, Context API, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: SQLite
- **Authentication**: JWT & `js-cookie` for session management
- **Data Analysis**: Chart.js for graphical data representation
- **Testing**: Postman
- **Deployment**: Firebase (for authentication and hosting)

## Getting Started

### Downloading

Click on the 'Code' button and clone this project via the command line or select 'Download Zip.'

### Installing and Running

1. Unzip the zip file if you downloaded this project as a zip file.
2. Open the project folder in your command line tool.
3. Run `npm install` in both the `api` and `client` folders.
4. In the `api` folder, run `npm run seed` to initialize the database with sample data.
5. Start the server by running `npm start` in the `api` folder.
6. Start the client by running `npm start` in the `client` folder.
7. Open your browser and navigate to http://localhost:3000 to view the app.

### Environment Setup

Create an `.env` file in the root of the `api` folder with the following:

```
DATABASE_URL=sqlite::memory
JWT_SECRET=your_secret_key
```

## Available Scripts

In the project directory, you can run:

- `npm install`: Installs and updates project dependencies.
- `npm run seed`: Initializes the database with sample data.
- `npm start`: Starts the app in development mode.

## Testing the API with Postman

To test the backend API, use Postman or any other API testing tool. Import the sample requests from the `PostmanCollection` folder to easily test all endpoints.

## Folder Structure

- `/client`: React frontend implementation
- `/api`: Backend implementation
  - `/models`: Sequelize models
  - `/controllers`: Request handling logic.

.
├── api
│   ├── app.js
│   ├── config
│   │   └── config.js
│   ├── middleware
│   │   ├── async-handler.js
│   │   ├── auth-jwt.js
│   │   └── auth-user.js
│   ├── models
│   │   ├── book.js
│   │   ├── conference.js
│   │   ├── course.js
│   │   ├── event.js
│   │   ├── index.js
│   │   ├── journal.js
│   │   ├── patent.js
│   │   └── user.js
│   ├── nodemon.json
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   ├── books.js
│   │   ├── conferences.js
│   │   ├── courses.js
│   │   ├── events.js
│   │   ├── journals.js
│   │   ├── login.js
│   │   ├── patents.js
│   │   ├── resourceFactory.js
│   │   └── users.js
│   └── seed
│       ├── data.json
│       └── seed_mysql.js
├── client
│   ├── build
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── assets
│   │   │   ├── index-BEUx7j2t.css
│   │   │   └── index-DzTL40Yq.js
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── netlify.toml
│   │   ├── robots.txt
│   │   └── site.webmanifest
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── netlify.toml
│   │   ├── robots.txt
│   │   └── site.webmanifest
│   ├── README.md
│   ├── src
│   │   ├── App.js
│   │   ├── components
│   │   │   ├── dashboard
│   │   │   │   └── Dashboard.js
│   │   │   ├── errors
│   │   │   │   ├── Forbidden.js
│   │   │   │   ├── NotFound.js
│   │   │   │   └── UnhandledError.js
│   │   │   ├── layout
│   │   │   │   ├── Header.js
│   │   │   │   └── Loading.js
│   │   │   ├── resource
│   │   │   │   ├── ResourceDetail.js
│   │   │   │   ├── ResourceForm.js
│   │   │   │   ├── ResourceList.js
│   │   │   │   └── ResourceReport.js
│   │   │   └── user
│   │   │       ├── UpdateUser.js
│   │   │       ├── UserSignIn.js
│   │   │       ├── UserSignOut.js
│   │   │       └── UserSignUp.js
│   │   ├── config.js
│   │   ├── Context.js
│   │   ├── Data.js
│   │   ├── index.js
│   │   ├── PrivateRoute.js
│   │   ├── resources
│   │   │   └── config.js
│   │   └── styles
│   │       ├── global.css
│   │       └── reset.css
│   ├── tailwind.config.js
│   └── yarn.lock
├── package.json
├── package-lock.json
└── README.md

20 directories, 82 files
