import express from 'express';
// Importing the auth controller
import { login, signup, logout } from '../controllers/auth.controller.js';
const router=express.Router();

router.post('/login',login);

router.post('/signup',signup);

router.post('/logout', logout);

export default router;
// This file defines the authentication routes for the application
