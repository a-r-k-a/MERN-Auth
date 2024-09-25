import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String, //resent this value when password is reset
    resretPasswordExpiresAt: Date,
    verificationToken: String, //update this value when varifivation is done
    verificationTokenExpiresAt: Date,
},{timestamps: true});

export const User = mongoose.model('User', userSchema);