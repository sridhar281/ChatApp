// This is the entry point for the backend server
import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from "dotenv";
import { connectDB } from './lib/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json()); 
app.use("/api/auth",authRoutes);
// console.log("Loaded port from env:",process.env.PORT); got an error in loading env 
app.listen(PORT, () => {
  console.log('Server is running on PORT:'+ PORT);
  connectDB()
});