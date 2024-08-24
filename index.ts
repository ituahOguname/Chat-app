import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import messageRouter from "./routes/message.route";

const app = express();
dotenv.config();

app.use("/api/v1", authRouter, messageRouter);


app.listen(3001, () => {
    console.log("Server running on port 5000");
});