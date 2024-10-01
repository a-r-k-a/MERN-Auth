import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = generateVerificationCode(); //this is the token which will be sent to the user through email
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });
    //jwt method which is also setting the cookie
    generateTokenAndSetCookie(res, user._id);
    //sending verification email
    await sendVerificationEmail(user.email, verificationToken);
    // saving the user to the database
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: null }, //spreading the properties of the created user but the password is set as null
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  //some kind of ui for entering the verification code
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code, //finding user by the verification_token
      verificationTokenExpiresAt: { $gt: Date.now() }, //just to verify that the token is not expired
    });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired verification token",
        });
    }
    user.isVerified = true;
    user.verificationToken = undefined; //deleting the value after the user is varified
    user.verificationTokenExpiresAt = undefined; //deleting the value after the user is verified
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error is verification email", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); //finding the user through the email provided in the request body
    if (!user) {
      //if the user does not exist
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    //comparing the password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      //if the password does not match
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(res, user._id); //generate token and cookie for user login

    user.lastLogin = new Date();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error logging in", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  //clear out the cookies so that we know that the user is unauthenticated
  //the cookie name is token
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //expiration of the token set to 1 hour

    //storing the token in the database
    user.resetPasswordToken = resetToken;
    user.resretPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    //send email
    await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    return res.status(200).json({success: true, message: 'Password reset mail sent successfully'})
  } catch (error) {
    console.log(error);
    return res.status(500).json({succes: false, message: 'Internal server error'});
  }
};

export const resetPassword = async (req, res) => {
  
};
