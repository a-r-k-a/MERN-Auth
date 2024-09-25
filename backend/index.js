import express from "express";
import dotenv from "dotenv";

import { connectDB } from "../db/connectDB.js";

import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

app.use(express.json()); //allows us to parse incoming requests:req.body

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("There was an error running the server");
    }
    connectDB();
    console.log(`Server is running on: ${process.env.PORT}`)
})