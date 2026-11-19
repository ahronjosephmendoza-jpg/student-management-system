# Student Management System

A full-stack student directory built with Node.js, Express, Prisma ORM, and MySQL. It demonstrates database connectivity and CRUD (Create, Read, Update, Delete), with a portfolio showcase page.

## Features
- Add student records (student number, name, email, course, year level)
- View and search student records
- Edit existing records
- Delete records with confirmation
- Persistent MySQL storage through Prisma ORM
- Responsive dashboard and portfolio project page
- Server-side validation and duplicate student number/email handling

## Technology stack
- Node.js and Express.js — application server and REST API
- Prisma ORM — database access and CRUD queries
- MySQL — relational database
- XAMPP — local MySQL server
- HTML, CSS, JavaScript — frontend

## Requirements
- Node.js 18 or newer and npm
- XAMPP (or another MySQL-compatible server)
- Web browser

## Database setup with XAMPP
1. Open XAMPP Control Panel and start MySQL.
2. Open phpMyAdmin at http://localhost/phpmyadmin.
3. Create a database named student_management.
4. Copy .env.example to .env in the project root.
5. Set DATABASE_URL to match your MySQL username and password. The default XAMPP example assumes root with no password:

```env
DATABASE_URL="mysql://root:@localhost:3306/student_management"
PORT=3000
```

If you configured a MySQL password, add it after root: and URL-encode special characters.

## Install and run
From the project folder, run:

```bash
npm install
npx prisma generate
npx prisma db push
npm start
```

Open http://localhost:3000. The Prisma db push command creates the Student table from prisma/schema.prisma. Records remain in MySQL after the server stops.

## Portfolio page
Open http://localhost:3000/portfolio to view the portfolio showcase.

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | List students; optional search with ?q= |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Create a student |
| PUT | /api/students/:id | Update a student |
| DELETE | /api/students/:id | Delete a student |

Example JSON body:
```json
{
  "studentNo": "2026-0004",
  "firstName": "Morgan",
  "lastName": "Dela Cruz",
  "email": "morgan@example.com",
  "course": "BS Information Technology",
  "yearLevel": 1
}
```

## Project structure
```text
student-management-system/
├── prisma/schema.prisma
├── public/index.html
├── public/styles.css
├── public/app.js
├── portfolio/index.html
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Notes
- Do not commit your real .env file or database password.
- This is an educational starter project. Before production deployment, add authentication, authorization, rate limiting, and secure environment configuration.
- Prisma Client is generated locally after dependency installation; it is not committed.

## License
For educational use.