import {Request, Response, NextFunction} from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs"
import generateToken from "../utils/generateToken";


interface ISignUpBody {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender: any;

}

export const signup = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body as ISignUpBody

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
        return next(new ErrorHandler("Internal Server Error", 500))
    }
})


export const login = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {username, password} = req.body;
        const user = await prisma.user.findUnique({where: {username}});

        if(!user){
            return next(new ErrorHandler("Invalid credentials", 400))
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if(!isPasswordCorrect){
            return next(new ErrorHandler("Invalid password", 400))
        }

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        })

    } catch (erro:any) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
})


export const logout = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully!"})
    } catch (error:any) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
})


export const getMe = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const user = await prisma.user.findUnique({where:{id:req.user.id }})

        if(!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
    } catch (error:any) {
        
    }
})