// src/index.js
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js'; // ← Use this app & server

dotenv.config();

// Apply middlewares to the SAME app
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});