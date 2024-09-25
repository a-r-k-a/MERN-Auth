import express from 'express'
import { login, logout, signup } from '../controllers/auth.controller.js';

const router = express.Router();

//signup route
router.post('/signup', signup);

//login route
router.get('/login', login);

//logout route
router.get('/logout', logout);

export default router;