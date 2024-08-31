import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import prisma from "../db/prisma";


export const sendMessage = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user.id;

        // check if there is existing conversation between sender and receiver
        let conversation = await prisma.conversation.findFirst({
            where:{
                participantIds: {
                    hasEvery: [senderId, receiverId],
                }
            }
        })

        // create a new conversation if there is none
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            })
        }

        // create a new message
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            }
        })

        //add message in the conversation
        if(newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        }
                    }
                }
            })
        }

        res.status(201).json({newMessage})

    } catch (error:any) {
        console.error("Erro in sendMessage: ", error.message);
        return next(new ErrorHandler("Internal Server Error", 500));
    }
});


export const getMessages = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy:{
                        createdAt: "asc"
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages)
        
    } catch (error:any) {
        return next(new ErrorHandler("Internal Server Erro", 500));
    }
})


export const getUsersForSidebar = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authUserId = req.user.id;

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true
            }
        })

        res.status(200).json(users);

    } catch (error:any) {
        return next(new ErrorHandler("Internal Server Erro", 500));
    }
})