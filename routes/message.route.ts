import express from "express";


const messageRouter = express.Router();


messageRouter.get("/conversation", (req, res) => {
    res.send("Conversation route")
})

export default messageRouter;