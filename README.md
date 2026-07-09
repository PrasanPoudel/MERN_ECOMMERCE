# Zentro — MERN E-Commerce Platform

A full-stack production-ready e-commerce platform built with the MERN stack.

## Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, React Router, Axios, Tailwind CSS v4
- **Backend**: Node.js, Express.js, MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Images**: Cloudinary (`ecommerce/` folder)
- **Payment**: DummyPay (simulated) + Cash on Delivery

# eCommerce Platform Project - MERN Stack

Welcome to the eCommerce Platform Project built using the MERN (MongoDB, Express.js, React, Node.js) Stack. This project provides a robust and full-featured online shopping platform with various functionalities to enhance the user experience.

Note: Please be aware that Render's free tier will automatically shut down after 15 minutes of inactivity. Consequently, the first request after reactivation may experience a delay, but subsequent requests will be faster.

## Live Website

[https://mern-ecommerce-frontend-hp3s.onrender.com](https://mern-ecommerce-frontend-hp3s.onrender.com)

## Demo User Logins

- **Live Admin Dashboard Login:**:
  - Email: demo_admin@zentro.com
  - Password: Password123

- **Live Customer Logins:**:
  - Email: johndoe@gmail.com
  - Password: Password123

Feel free to explore and customize this eCommerce platform for your specific needs.

## Getting Started

### Prerequisites

1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine

```bash
git clone https://github.com/your-username/MERN_ECOMMERCE.git
```

```bash
cd MERN_ECOMMERCE
```

3. Create a MongoDB database and obtain your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Env Variables

1. Rename the `.env.example` file to `.env` and add the following environment variables:

```dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

### Install Dependencies

Run the following commands to install dependencies for both the frontend and backend:

```bash
npm install
cd frontend
npm install
```

### Run

To run both the frontend and backend concurrently, use:

```bash
npm run dev
```

To run only the backend:

```bash
npm run dev
```

## Build & Deploy

To create a production build for the frontend:

```bash
cd frontend
npm run build
```

## Thank You!
