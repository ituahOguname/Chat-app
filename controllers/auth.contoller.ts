import {Request, Response, NextFunction} from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs"
import generateToken from "../utils/generateToken";


// interface ISignUpBody {
//     fullName: string;
//     username: string;
//     password: string;
//     confirmPassword: string;
//     gender: any;

// }

export const signup = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return next(new ErrorHandler("Please fill in all the fields", 400))
        }
        if (password !== confirmPassword) {
            return next(new ErrorHandler("Passwords don't match", 400))
        }

        const user = await prisma.user.findUnique({where: {username}});

        if (user) {
            return next(new ErrorHandler("Username already exists", 400))
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            }
        });

        if(newUser) {
            //generate token in a sec
            generateToken(newUser.id, res)

            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        } else {
            return next(new ErrorHandler("Invalid User data", 400))
        }
    } catch (error:any) {
        return next(new ErrorHandler("INternal Server Error", 500))
    }
})



export const login = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {

})

export const logout = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {

})