Airbnb-Prototype

This is a prototype of Airbnb using ReactJS frontend, Node.js/Express backend, MySQL database, and Sequelize ORM. It includes basic traveler and owner features along with an AI agent integration for itinerary planning.

Table of Contents

Prerequisites

Backend Setup

Clone Repository

Install Dependencies

Database Setup

Configure Database Connection

Run Migrations

Team Workflow with Sequelize

Frontend Setup

Running the Application

Notes

Prerequisites

Node.js v18+

npm (comes with Node.js)

MySQL Server (local installation)

Optional: Git client

Backend Setup
Clone Repository
git clone https://github.com/<your-username>/Airbnb-Prototype.git
cd Airbnb-Prototype/backend

Install Dependencies
npm install


Installs sequelize, sequelize-cli, mysql2, and other dependencies.

Database Setup

Log into MySQL:

mysql -u root -p


Create the database and a development user:

CREATE DATABASE airbnb_db;

CREATE USER 'airbnb_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON airbnb_db.* TO 'airbnb_user'@'localhost';
FLUSH PRIVILEGES;


Make sure the database name matches backend/config/config.json.

Configure Database Connection

Edit backend/config/config.json:

{
  "development": {
    "username": "airbnb_user",
    "password": "password123",
    "database": "airbnb_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": { },
  "production": { }
}


Optionally, use .env to store credentials securely.

Run Migrations

Create tables based on Sequelize models:

npx sequelize-cli db:migrate


To seed initial data (optional):

npx sequelize-cli db:seed:all


Verify connection (optional):

node src/config/db.js


You should see: ✅ Database connected successfully

Team Workflow with Sequelize
Pull Latest Changes
git pull origin dev
npx sequelize-cli db:migrate

Creating a New Feature
git checkout dev
git pull origin dev
git checkout -b feature/<feature-name>

npx sequelize-cli model:generate --name <ModelName> --attributes <field:type,...>
npx sequelize-cli db:migrate

git add .
git commit -m "feat: add <ModelName> model and migration"
git push -u origin feature/<feature-name>


Open a Pull Request to merge into dev.

Keeping Databases in Sync

Pull latest migrations:

git pull origin dev
npx sequelize-cli db:migrate


Reset database if needed:

npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate

Frontend Setup
Navigate to frontend folder
cd ../frontend

Install Dependencies
npm install

Run Frontend
npm start


The app will run at http://localhost:3000 by default.

Make sure the backend API (http://localhost:4000) is running.

Running the Application

Start backend:

cd backend
npm run dev


Start frontend:

cd frontend
npm start


Access the app in your browser: http://localhost:3000

Notes

Each teammate should use their own local database.

Always use Sequelize migrations and seeds to sync schema.

Feature branches should be created from dev.
Commit messages should be descriptive, e.g., feat: add Booking model.

Do not include node_modules in the repo; use package.json to install dependencies.