# Hekto Server

## Overview
The backend of this e-commerce platform is built with **Express.js**, leveraging a robust set of modern technologies to ensure scalability, security, and performance. It provides a RESTful API for managing authentication, products, orders, and payments while integrating essential tools for cloud storage and email services.

## Features
- **Authentication:** Secure user login, registration, and session management with JWT.
- **Product Management:** CRUD operations for products, including image uploads using Cloudinary.
- **Order Management:** Endpoints for managing carts, orders, and payments.
- **Email Notifications:** Integration with Nodemailer for sending transactional emails.
- **Payment Gateway Integration:** Seamless payment processing.
- **Validation:** Data validation using Zod.
- **Database Management:** Prisma ORM for interacting with a relational database.

## API Features
1. **Authentication:**
   - User registration and login.
   - Secure JWT token generation and management.
   - Password hashing with bcrypt.

2. **Product Management:**
   - Add, edit, delete, and fetch product details.
   - Cloud-based image storage using Cloudinary.

3. **Order and Cart Management:**
   - Manage user carts and orders.
   - Update order status and retrieve order history.

4. **Payment Processing:**
   - Handle payments via integrated payment gateways.
   - Verify and record transaction details.

5. **Email Services:**
   - Send order confirmation and account-related emails.

6. **General Utilities:**
   - Middleware for error handling and status management.
   - Cookie-based user session support.

---

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Prisma with a relational database
- **Authentication:** JWT and bcrypt
- **Image Storage:** Cloudinary
- **Email Service:** Nodemailer
- **Validation:** Zod
- **Utility Libraries:** Axios, Multer, and Http-Status
- **Dev Tools:** TypeScript, TSX, and Nodemon

---

## Links
- **API:** [hekto-server.vercel.app](https://hekto-server.vercel.app/)  
- **Frontend Application:** [hekto-1a747.web.app](https://hekto-1a747.web.app/)  
