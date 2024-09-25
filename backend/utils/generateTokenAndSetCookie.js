import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '7d'
    })
    //setting cookie
    res.cookie("token", token, {
        httpOnly: true, //cookie cannot be accessed by cliebt side js (only through http)
        secure: process.env.NODE_ENV === "production", //secure only in the production environment
        sameSite: "strict", //prevents csrf attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    })

    return token;
}