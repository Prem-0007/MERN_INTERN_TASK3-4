# MERN Task Manager App

A full-stack MERN Task Manager application with:

* User Authentication (JWT)
* CRUD Task Management
* Dockerized Frontend + Backend + MongoDB
* React Frontend with Vite
* Express & MongoDB Backend

---

# Tech Stack

## Frontend

* React
* Vite
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

## DevOps

* Docker
* Docker Compose

---

# Features

* User Signup
* User Login
* JWT Authentication
* Protected Routes
* Create Tasks
* Update Tasks
* Delete Tasks
* Mark Tasks Completed
* MongoDB Database Integration
* Fully Dockerized Setup

---

# Project Structure

```bash
project-root/
│
├── backend/
│   ├── src/
│   │   ├── middlewares/
│   │   ├── mongoose/
│   │   ├── routes/
│   │   ├── utils/
│   │   
│   │
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── index.mjs
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

# Environment Variables

## Backend `.env`

```env
PORT=3000

MONGO_URI=mongodb://mongo_db:27017/mern_tasks

JWT_SECRET=your_secret_key
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Prem-0007/MERN_INTERN_TASK3-4.git

cd MERN_INTERN_TASK3-4
```

---

# Backend Setup

```bash
cd backend

npm install
```

## Run Backend

```bash
node index.mjs
```

Backend runs on:

```bash
http://localhost:3000
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Docker Setup

## Build & Start Containers

```bash
docker compose up --build
```

---

# Docker Containers

| Container          | Port  |
| ------------------ | ----- |
| frontend_container | 5173  |
| backend_container  | 3000  |
| mongo_db           | 27017 |

---

# Docker Commands

## Start Containers

```bash
docker compose up
```

## Start in Detached Mode

```bash
docker compose up -d
```

## Stop Containers

```bash
docker compose down
```

## Rebuild Containers

```bash
docker compose up --build
```

## View Logs

```bash
docker compose logs
```

---

# API Endpoints

# Authentication Routes

## Signup

```http
POST /api/auth/signup
```

### Body

```json
{
  "username": "prem",
  "email": "prem@test.com",
  "password": "123456"
}
```

---

## Login

```http
POST /api/auth/login
```

### Body

```json
{
  "email": "prem@test.com",
  "password": "123456"
}
```

---

## Auth Status

```http
GET /api/auth/status
```

### Headers

```http
Authorization: Bearer YOUR_TOKEN
```

---

# Task Routes

## Get All Tasks

```http
GET /api/tasks
```

---

## Create Task

```http
POST /api/tasks
```

### Body

```json
{
  "title": "Learn MERN",
  "description": "Practice full stack development"
}
```

---

## Update Task

```http
PUT /api/tasks/:id
```

---

## Delete Task

```http
DELETE /api/tasks/:id
```

---

# MongoDB Compass

## Connection URL

```bash
mongodb://localhost:27017
```

## Database Name

```bash
mern_tasks
```

Collections:

* users
* tasks

---

# Verify MongoDB Data

Open Mongo Shell:

```bash
docker exec -it mongo_db mongosh
```

Use database:

```bash
use mern_tasks
```

Show collections:

```bash
show collections
```

View users:

```bash
db.users.find().pretty()
```

View tasks:

```bash
db.tasks.find().pretty()
```

---

# Docker Compose Example

```yaml
services:
  frontend:
    build: ./frontend
    container_name: frontend_container
    ports:
      - "5173:5173"
    depends_on:
      - backend

  backend:
    build: ./backend
    container_name: backend_container
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    environment:
      - MONGO_URI=mongodb://mongo_db:27017/mern_tasks

  mongo:
    image: mongo
    container_name: mongo_db
    ports:
      - "27017:27017"
```

---

# Common Issues

## MongoDB Not Showing Latest Data in Compass

Reason:

* Multiple MongoDB connections/databases
* Compass cache issue

Fix:

* Refresh Compass
* Remove old connections
* Reconnect using:

```bash
mongodb://localhost:27017
```

---

## Backend Not Connecting to Database

Check:

```js
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("Connected to database")
  )
  .catch((err) =>
    console.log(err)
  );
```

Make sure `.env` contains:

```env
MONGO_URI=mongodb://mongo_db:27017/mern_tasks
```

---

# Future Improvements

* Refresh Tokens
* Role Based Access
* Task Filters
* Search Tasks
* Pagination
* Dark Mode
* Deployment on Render/AWS

---

# Author

Balla Prem Kumar

* MERN Stack Developer
* Backend Developer
* React Developer
* Docker Enthusiast

---

# License

MIT License
