import express from "express";
import protectRoute from "../middleware/protectRoute";
import { sendMessage, getMessages, getUsersForSidebar } from "../controllers/message.controller";
const messageRouter = express.Router();


messageRouter.get("conversation", protectRoute, getUsersForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter;