//check for the token if it is valid or not 

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token; //because the name of the cookie is token
    try {
        if (!token) return res.status(401).json({success: false, message: 'Unauthorized - no token provided'});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({success: false, message: 'Unauthorized - token invalid'})
        req.userId = decoded.userId; //adding userId field to the request, which willbe the userId that we have in the token
        next();
    } catch (error) {
        console.log("Error in verifying token: ", error);
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}