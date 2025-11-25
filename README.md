# CHATTAPP

Connect Instantly, Communicate Seamlessly, Empower Every Conversation

## Built with the tools and technologies:

Express, JSON, Markdown, Socket.io, npm, Autoprefixer, Mongoose, PostCSS, .ENV, JavaScript, Nodemon, DaisyUI, React, Cloudinary, Vite, ESLint, Axios, date-fns.

---

## Overview

ChatApp is a full-stack, real-time chat platform that empowers developers to build scalable and engaging messaging applications with ease. It integrates secure user authentication, multimedia handling, and a modern React frontend, all orchestrated within a robust architecture.

### Why ChatApp?

This project streamlines the development of real-time communication tools. The core features include:

* **WebSocket Integration**: Enables instant, bidirectional messaging for a seamless chat experience.
* **Cloudinary Media Support**: Simplifies image and video uploads, ensuring reliable media management.
* **Secure Authentication**: Implements JWT-based login, registration, and route protection for user security.
* **Customizable UI Themes**: Offers flexible styling options to personalize the user interface.
* **Modern Development Setup**: Utilizes React with Vite, Tailwind, and DaisyUI for rapid, scalable UI development.
* **State Management & Utilities**: Provides structured handling of chat, auth, and theme states for a cohesive experience.

---

## Prerequisites

Before installing and running this project, ensure you have the following installed:

Node.js (>= 18.x recommended)
npm or yarn
MongoDB (local or cloud instance)
Cloudinary Account (for media uploads)
Git

Environment variables required:

```
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Installation

Follow the steps below to set up the project locally.

### 1. Clone the Repository

```
git clone https://github.com/sridhar281/ChatApp.git
cd ChatApp
```

### 2. Install Server Dependencies

```
cd backend
npm install
```

### 3. Install Client Dependencies

```
cd ../frontend
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file inside the `backend` folder and fill in the required values.

### 5. Start the Development Servers

#### Backend:

```
cd backend
npm run dev
```

#### Frontend:

```
cd frontend
npm run dev
```

---

## Usage

Once both servers are running:

* Access the frontend at **[http://localhost:5173](http://localhost:5173)** (Vite default)
* Backend API runs at **[http://localhost:5000](http://localhost:5000)** (or configured PORT)

### Features you can try:

* Register and login users
* Real-time chat using Socket.io
* Send text, images, and videos
* View online/offline statuses
* Switch themes

---

## Testing

### Manual Testing

* Verify authentication flows (login, logout, registration)
* Test real-time messaging between two browser windows
* Upload images/videos via Cloudinary
* Check protected API routes
* Test responsiveness on mobile and desktop

### Automated Testing (Optional Setup)

If you choose to add tests:

* Use **Jest** for backend unit tests
* Use **React Testing Library** for frontend tests

---

## Getting Started

Refer to the steps above under **Installation** and **Usage** to begin working with the project.


