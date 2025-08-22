import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {connectDB} from './lib/db.js'

dotenv.config();

const app= express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use("/api/auth",authRoutes)
const PORT =process.env.PORT||3002;

app.listen(PORT,()=>{
  console.log("Server is running on port", +PORT);
  connectDB();
})

