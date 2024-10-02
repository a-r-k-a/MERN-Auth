import express from 'express'
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

//signup route
router.post('/signup', signup);

//login route
router.post('/login', login);

//logout route
router.post('/logout', logout);

//verification route
router.post('/verify-email', verifyEmail);

//route for forget password
router.post('/forgot-password', forgotPassword);

//route for resetting the password (when clicked on Reset Password button in the forget password mail)
router.post('/reset-password/:token', resetPassword);

export default router;