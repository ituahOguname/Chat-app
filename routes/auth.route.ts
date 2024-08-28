import express from "express";
import { login, logout, signup } from "../controllers/auth.contoller";
const authRouter = express.Router();
const router = express.Router();


authRouter.post("/signup", signup);
// authRouter.get("/login", login);
// authRouter.get("/logout", logout);

// router.post("/signup", signup);


export default authRouter;