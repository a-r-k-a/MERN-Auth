//contains all the routes 

import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//call this route in the forntebd to check if the user is authenticated or not
//verifyToken is the middleware for token verification
//if we have this token go to the checkAuth method
router.get("/check-auth", verifyToken, checkAuth);

//signup route
router.post("/signup", signup);

//login route
router.post("/login", login);

//logout route
router.post("/logout", logout);

//verification route
router.post("/verify-email", verifyEmail);

//route for forget password
router.post("/forgot-password", forgotPassword);

//route for resetting the password (when clicked on Reset Password button in the forget password mail)
router.post("/reset-password/:token", resetPassword);

export default router;
