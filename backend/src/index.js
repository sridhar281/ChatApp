// This is the entry point for the backend server
import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
// Middleware to parse JSON bodies 
app.use("/api/auth",authRoutes);
app.use("/api/messa",messageRoutes)
// console.log("Loaded port from env:",process.env.PORT); got an error in loading env 
app.listen(PORT, () => {
  console.log('Server is running on PORT:'+ PORT);
  connectDB()
});