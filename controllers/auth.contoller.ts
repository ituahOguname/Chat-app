import {Request, Response, NextFunction} from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";


export const signup = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {

})

export const login = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {

})

export const logout = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {

})