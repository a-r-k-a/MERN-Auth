import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";

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
    await user.save();
    //jwt method which is also setting the cookie
    generateTokenAndSetCookie(res, user._id);
    //sending verification email
    await sendVerificationEmail(user.email, verificationToken);
    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        user: { ...user._doc, password: null }, //spreading the properties of the created user but the password is set as null
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("login route");
};

export const logout = async (req, res) => {
  res.send("logout route");
};
