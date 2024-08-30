import express from "express";
import { login, logout, signup, getMe } from "../controllers/auth.contoller";
import protectRoute from "../middleware/protectRoute";
const authRouter = express.Router();

authRouter.get("/me", protectRoute, getMe)
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;