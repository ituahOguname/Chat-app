import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route";
dotenv.config();
const app = express();

app.use(cookieParser())
app.use(express.json()); // for parsing application/json


app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
});