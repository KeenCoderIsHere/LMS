# Library Management System

[Live Demo](https://lms-mu-gilt.vercel.app/) | [GitHub Repository](https://github.com/KeenCoderIsHere/LMS)

A full-stack library management system with role-based access control, Redis caching, and automated fine computation.

## Features

### Authentication

- JWT-based authentication for students and administrators.
- Role-based access control with separate portals for students and admins.
- Secure password hashing using bcrypt.
- Protected routes with middleware.

### Book Management

- Add books with ISBN, title, author, genre, and copy count.
- View available books with search and filter functionality.
- Track available copies for each book.
- ISBN validation (6-digit numeric).

### Transactions

- Borrow books with automatic availability checks.
- Return books with automatic availability updates.
- Prevent borrowing of already borrowed books.
- Transaction history for each student.
- Borrowing limit tracking per student.

### Fine System

- Automated fine computation for overdue books.
- Daily fine increment of 10 Rs per overdue book.
- Fine calculation runs as a background job.
- Due amount displayed on student dashboard.

### Caching

- Redis caching for book lists with configurable TTL.
- Cache invalidation on book addition or update.
- Reduced database load for frequent queries.

### Admin Portal

- View all students with their borrowed books.
- View all transaction records.
- Add new books to the library.
- View all available books with copies.
- Admin authentication with JWT.

### Student Portal

- Sign up and sign in functionality.
- View available books with search.
- Borrow books with one-click action.
- View borrowed books with due dates.
- View pending dues.
- Return borrowed books.


## Technology Stack

**Runtime:** Node.js

**Framework:** Express.js

**Frontend:** React.js with React Router

**Database:** MongoDB with Mongoose ODM

**Caching:** Redis

**Authentication:** JSON Web Tokens (JWT), Bcrypt

**HTTP Client:** Fetch API

**Styling:** Tailwind CSS


## Architecture

The application follows the MVC pattern with a clear separation of concerns.

**Backend:** Express.js server with modular route handlers, controllers for business logic, and Mongoose models for database operations. Middleware handles authentication, error handling, and request validation.

**Frontend:** React.js application with component-based architecture. Pages are organised by role (student/admin) with protected routing. State is managed locally with React hooks.

**Database:** MongoDB stores students, books, and transaction records. Redis is used for caching book lists to improve performance.

**Caching Layer:** Redis caches book lists with a 1-hour TTL for student views and 5-minute TTL for admin views. Cache is invalidated when books are added or updated.


## Getting Started

### Prerequisites

- Node.js version 16 or higher.
- MongoDB instance (local or cloud).
- Redis instance (local or cloud).

### Installation

1.  Clone the repository:
    git clone https://github.com/KeenCoderIsHere/LMS.git
    cd LMS

2.  Install backend dependencies:
    cd server
    npm install

3.  Install frontend dependencies:
    cd client
    npm install

4.  Create a `.env` file in the server directory with the required environment variables.

5.  Start the backend server:
    cd server
    npm start

6.  Start the frontend development server:
    cd client
    npm run dev

7.  Access the application at `http://localhost:5173`.


## Environment Variables

Create a `.env` file in the server directory with the following variables:

PORT=5000
DB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379


**Variable Descriptions:**

- `PORT`: Port on which the backend server listens. Default is `5000`.
- `DB_URI`: MongoDB connection string. This is required.
- `JWT_SECRET`: Secret key for JWT token generation. This is required.
- `JWT_EXPIRES_IN`: Token expiration duration (e.g., `7d`, `24h`). Default is `7d`.
- `REDIS_URL`: Redis connection URL. Default is `redis://localhost:6379`.


## API Documentation

### Student Authentication

**POST /api/v1/student/signup**

Register a new student account.

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "success": true,
  "message": "Student Account Created Successfully!",
  "data": {
    "student": { ... },
    "token": "jwt_token_here"
  }
}
```

**POST /api/v1/student/signin**

Login an existing student.

Request Body:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response:
```json
{
  "success": true,
  "message": "Logged In Successfully!",
  "data": {
    "token": "jwt_token_here",
    "student": { ... }
  }
}
```

**GET /api/v1/student/me**

Get current student profile.

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "student": { ... }
}
```

### Student Book Operations

**GET /api/v1/student/view-books**

Get all available books.

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "books": [ ... ]
}
```

**GET /api/v1/student/borrow/:bookId**

Borrow a book by ID.

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "message": "Book borrowed successfully!",
  "data": { ... }
}
```

**GET /api/v1/student/view-borrowed-books**

Get books borrowed by the current student.

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "data": [
    {
      "title": "Book Title",
      "isbn": "123456",
      "author": "Author Name",
      "genre": "Fiction",
      "borrowedDate": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-01-20T10:30:00.000Z",
      "bookId": "..."
    }
  ],
  "amount": 0
}
```

**PUT /api/v1/student/return/:bookId**

Return a borrowed book.

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "success": true,
  "message": "Book returned successfully!",
  "data": { ... }
}
```

### Admin Authentication

**POST /api/v1/admin/signin**

Login an admin account.

Request Body:
```json
{
  "email": "admin@library.com",
  "password": "AdminPass123!"
}
```

Response:
```json
{
  "success": true,
  "message": "Admin Logged In Successfully!",
  "data": {
    "email": "admin@library.com",
    "token": "jwt_token_here"
  }
}
```

### Admin Operations

**GET /api/v1/admin/students**

Get all students with their borrowed books.

Headers: `Authorization: Bearer <token>` (Admin only)

Response:
```json
{
  "success": true,
  "students": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "booksBorrowed": [ ... ]
    }
  ]
}
```

**GET /api/v1/admin/records**

Get all transaction records.

Headers: `Authorization: Bearer <token>` (Admin only)

Response:
```json
{
  "success": true,
  "records": [
    {
      "isbn": "123456",
      "title": "Book Title",
      "studentEmail": "john@example.com",
      "borrowedDate": "2024-01-15T10:30:00.000Z",
      "dueDate": "2024-01-20T10:30:00.000Z"
    }
  ]
}
```

**GET /api/v1/admin/admin-books**

Get all books with copies.

Headers: `Authorization: Bearer <token>` (Admin only)

Response:
```json
{
  "success": true,
  "books": [
    {
      "title": "Book Title",
      "author": "Author Name",
      "isbn": "123456",
      "genre": "Fiction",
      "count": 5
    }
  ]
}
```

**POST /api/v1/admin/add-book**

Add a new book to the library.

Headers: `Authorization: Bearer <token>` (Admin only)

Request Body:
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "123456",
  "genre": "Fiction",
  "copies": 5
}
```

Response:
```json
{
  "success": true,
  "message": "Book added successfully!",
  "book": { ... }
}
```

---

## Project Structure

```
LMS/
├── server/
│   ├── app.js                     # Entry point
│   ├── config/
│   │   ├── env.js                 # Environment variables
│   │   └── redis.js               # Redis connection
│   ├── controllers/
│   │   ├── admin.controller.js    # Admin operations
│   │   ├── book.controller.js     # Book operations
│   │   └── student.controller.js  # Student operations
│   ├── database/
│   │   └── mongodb.js             # Database connection
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT authentication
│   │   └── error.middleware.js    # Error handling
│   ├── models/
│   │   ├── admin.model.js         # Admin schema
│   │   ├── book.model.js          # Book schema
│   │   ├── record.model.js        # Transaction schema
│   │   └── student.model.js       # Student schema
│   ├── routes/
│   │   ├── admin.routes.js        # Admin routes
│   │   └── student.routes.js      # Student routes
│   └── service/
│       └── fine.service.js        # Fine computation
├── client/
│   ├── src/
│   │   ├── App.jsx                # Main component with routes
│   │   ├── components/
│   │   │   ├── AdminAddBook.jsx
│   │   │   ├── AdminBooks.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminSignIn.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── BorrowedBooks.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Records.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentSignIn.jsx
│   │   │   ├── StudentSignUp.jsx
│   │   │   └── ViewStudents.jsx
│   │   └── config/
│   │       └── env.js             # Frontend environment variables
│   └── index.html
└── README.md
```

---

## Database Collections

**students:** Stores student information including name, email, hashed password, borrowed books, and due amount.

**admins:** Stores admin credentials with hashed passwords.

**books:** Stores book details including title, author, ISBN, genre, and available copies.

**records:** Stores transaction history including ISBN, title, student email, borrowed date, and due date.

---

## Deployment Notes

- The application is designed for deployment on platforms like Render (backend) and Vercel (frontend).
- Environment variables must be configured on the deployment platform.
- Redis should be set up as a separate service (e.g., Render Redis).
- MongoDB Atlas is recommended for production database.
- The fine computation runs as a scheduled job and requires the server to be running continuously.

---

## Author

Susheeth Venkatraman S  
GitHub: [KeenCoderIsHere](https://github.com/KeenCoderIsHere)  
LinkedIn: [susheeth-venkatraman](https://www.linkedin.com/in/susheeth-venkatraman/)  
Email: susheethvenkatraman@gmail.com
```
