import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { connectDB } from "../db/connectDB.js";

import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json()); //allows us to parse incoming requests:req.body
app.use(cookieParser()); //allows us to pass incoming cookies

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("There was an error running the server");
    }
    connectDB();
    console.log(`Server is running on: ${process.env.PORT}`)
})