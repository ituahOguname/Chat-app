import jwt, { JwtPayload } from "jsonwebtoken";
require("dotenv").config();
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        export interface Request{
            user: {
                id: string;
            }
        }
    }
}

const protectRoute = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return next(new ErrorHandler("Unauthorized - No token provided", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        
        if(!decoded) {
            return next(new ErrorHandler("Unauthorized - Invalid Token", 401))
        }

        const user = await prisma.user.findUnique({where: {id: decoded.userId}, select: {id:true, username:true , fullName:true, profilePic: true}})

        if(!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        req.user = user

        next();

    } catch (error:any) {
        console.log("Error in protectedRoute middleware", error.message);
        return next(new ErrorHandler("Internal Server Erro", 500))
    }
}

export default protectRoute;