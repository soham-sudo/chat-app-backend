import { errorHandler } from "../utils/errorHandler.js";

import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            return next(errorHandler(401, "Empty token"))
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            return next(errorHandler(401, "Invalid Access Token"))
        }
    
        req.user = user;
        next()
    } catch (error) {
        return next(errorHandler(401,"Invalid access token"))
    }   
}