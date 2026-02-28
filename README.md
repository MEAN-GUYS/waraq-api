# Waraq API

A RESTful API for an e-commerce platform for a bookstore (Waraq). It handles user authentication, book catalog management, authors, categories, shopping carts, order processing, and user reviews.

---

## 1. ✨ Features
- **User Authentication & Authorization**: Secure signup, login, password reset, and role-based access control (Admin/User) using JSON Web Tokens (JWT).
- **Book Management (CRUD)**: Create, read, update, and delete books containing details like stock, pricing, and images.
- **Author & Category Management**: Link books to specific authors and categorize them.
- **Shopping Cart & Checkout**: }art operations with order processing.
- **Review System**: Users can rate and leave comments on books they have purchased.
- **Image Uploads**: Cloudinary integration for handling book covers and other media.

---

## 2. 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose (ODM)
- **Authentication**: JWT & bcryptjs
- **Validation**: Joi
- **Image Handling**: Multer & Cloudinary
- **Email Service**: Nodemailer
- **Code Quality**: ESLint, Prettier, Husky & Lint-Staged
- **API Documentation**: Swagger UI Express

---

## 3. 🗺️ Getting Started

### Prerequisites
Make sure you have the following installed to run the project:
* Node.js (>= 18.0.0)
* MongoDB (Locally or MongoDB Atlas)
* A Cloudinary account (for image hosting)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd waraq-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory by copying the example provided:
   ```bash
   cp .env.example .env
   ```

### Environment Variables Explanation
Open the `.env` file and configure the values to match your local setup:

| Variable | Description |
| :--- | :--- |
| **`NODE_ENV`** | Defines the environment (`development`, `production`, `test`). |
| **`PORT`** | The port on which the API server runs (e.g., `3000`). |
| **`CLIENT_URL`** | The URL of the frontend application interfacing with this API. |
| **`MONGODB_URL`** | Your MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/waraq-api`). |
| **`JWT_SECRET`** | A strong, random string used to sign JSON Web Tokens. |
| **`JWT_ACCESS_EXPIRATION_MINUTES`** | The lifespan of an access token in minutes (e.g., `30`). |
| **`JWT_REFRESH_EXPIRATION_DAYS`** | The lifespan of a refresh token in days (e.g., `30`). |
| **`EMAIL_USER`** | The email address utilized by Nodemailer for sending automated emails. |
| **`EMAIL_PASS`** | The app-specific password for the email address provided above. |
| **`CLOUDINARY_Cloud_NAME`** | Your Cloudinary account's cloud name for storing uploaded images. |
| **`CLOUDINARY_API_KEY`** | Your Cloudinary API key. |
| **`CLOUDINARY_API_SECRET`** | Your Cloudinary API secret. |

### Running the Project

To start the server in development mode (with auto-reloading using Nodemon):
```bash
npm run dev
```

To run the project in production mode:
```bash
npm start
```

---

## 4. 🗄️ ERD Diagram

Following is the Entity-Relationship Diagram representing the relational architecture of the MongoDB database schema:
<img width="1600" height="987" alt="image" src="https://github.com/user-attachments/assets/bbe8ec15-cb06-4796-9160-94bf8515bfae" />


## 5. 🔌 API Endpoints

Once the application is running, an interactive API Explorer (Swagger) is available at `/v1/docs` (e.g. `http://localhost:3000/v1/docs`). Below is a swift overview of the available endpoints:

### Auth Routes (`/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login to account
- `POST /logout` - Logout a user
- `POST /refresh-tokens` - Refresh user's auth token
- `POST /forgot-password` - Request a password reset email
- `POST /reset-password` - Reset account password

### User Routes (`/v1/users`)
- `POST /` - Create a user (Admin)
- `GET /` - Retrieve a paginated list of users (Admin)
- `GET /:userId` - Retrieve a user's details
- `PATCH /:userId` - Update user information
- `DELETE /:userId` - Delete a user

### Book Routes (`/v1/books`)
- `POST /` - Add a new book (Admin)
- `GET /` - Retrieve a paginated list of books (supports searching/filtering)
- `GET /:id` - Retrieve book details
- `PATCH /:id` - Update a book (Admin)
- `DELETE /:id` - Delete a book (Admin)

### Author Routes (`/v1/authors`)
- `POST /` - Add a new author (Admin)
- `GET /` - Retrieve authors
- `GET /:id` - Retrieve author details
- `PATCH /:id` - Update an author (Admin)
- `DELETE /:id` - Delete an author (Admin)

### Category Routes (`/v1/categories`)
- `POST /` - Add a new category (Admin)
- `GET /` - Retrieve categories
- `GET /:id` - Retrieve category details
- `PATCH /:id` - Update a category (Admin)
- `DELETE /:id` - Delete a category (Admin)

### Cart Routes (`/v1/carts`)
- `POST /` - Add an item to the shopping cart
- `GET /` - View your active cart contents
- `PATCH /` - Update items natively within your cart
- `DELETE /` - Clear the entire cart or remove an item

### Order Routes (`/v1/orders`)
- `POST /` - Create an order from your current cart
- `GET /` - Retrieve order history

### Review Routes (`/v1/reviews`)
- `POST /` - Create a review for a book
- `GET /` - List reviews for a specific book/context
- `PATCH /:id` - Update an existing review
- `DELETE /:id` - Remove a review

---
